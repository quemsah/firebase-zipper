const functions = require("firebase-functions");
//exports.helloWorld = functions.https.onRequest((request, response) => {
const {
  createWriteStream: writeStr,
  createReadStream: readStr
} = require("fs");
const jimp = require("jimp");
const Busboy = require("busboy");
const path = require("path");
const os = require("os");
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers":
    "cors,my,Content-Type,Accept,Access-Control-Allow-Headers"
};
exports.helloWorld = functions.https.onRequest((r, rs) => {
  if (r.method == "GET") {
    readStr("./index.html").pipe(r.res);
    return;
  }
  if (r.method == "POST") {
    console.log("1");
    const d = { "Content-type": "image/jpeg" };
    console.log("2");
    rs.writeHead(200, { ...d, ...cors });
    console.log("3");
    const busboy = new Busboy({ headers: r.headers });
    console.log("TCL: busboy", busboy)
    const tmpdir = os.tmpdir();
    console.log("TCL: tmpdir", tmpdir)
    const fields = {};
    const uploads = {};
    console.log("TCL: fields", fields)
    console.log("TCL: uploads", uploads)
    const fileWrites = [];
    console.log("TCL: fileWrites", fileWrites)
    // This code will process each file uploaded.
    busboy.on("file", (fieldname, file, filename) => {
      // Note: os.tmpdir() points to an in-memory file system on GCF
      // Thus, any files in it must fit in the instance's memory.
      console.log(`Processed file ${filename}`);
      const filepath = path.join(tmpdir, filename);
      uploads[fieldname] = filepath;

      const writeStream = fs.createWriteStream(filepath);
      file.pipe(writeStream);

      // File was processed by Busboy; wait for it to be written to disk.
      const promise = new Promise((resolve, reject) => {
        file.on("end", () => {
          writeStream.end();
        });
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });
      fileWrites.push(promise);
    });

    // Triggered once all uploaded files are processed by Busboy.
    // We still need to wait for the disk writes (saves) to complete.
    busboy.on("finish", async () => {
      await Promise.all(fileWrites);

      // TODO(developer): Process saved files here
      for (const file of uploads) {
        fs.unlinkSync(file);
      }
      res.send();
    });

    busboy.end(r.rawBody);
    // const busboy = new Busboy({ headers: r.headers });
    // const tmpIm1 = "/tmp/file1" + Math.random() + ".tmp";
    // const tmpIm2 =
    //   "/tmp/file1" + Math.random() + "_" + Math.random() + ".tmp";
    // busboy
    //   .on("file", (_, file) => {
    //     file.pipe(writeStr(tmpIm1)).on("finish", () => {
    //       jimp
    //         .read(tmpIm1)
    //         .then(x => x.flip(true, false))
    //         .then(x =>
    //           x.write(tmpIm2, e => {
    //             if (!e) {
    //               readStr(tmpIm2).pipe(rs);
    //             } else {
    //               rs.end(e.stack);
    //             }
    //           })
    //         );
    //     });
    //   })
    //   .on("error", e => rs.end("ERROR boy"));
    // r.pipe(busboy);
  }
});
