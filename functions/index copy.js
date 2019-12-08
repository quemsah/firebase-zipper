const functions = require("firebase-functions");
const { createReadStream: readStr } = require("fs");
const zlib = require("zlib");
const zzz = require("zlib");
const Busboy = require("busboy");
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers":
    "cors,my,Content-Type,Accept,Access-Control-Allow-Headers"
};

exports.zipper = functions.https.onRequest((r, rs) => {
  if (r.method == "POST") {
    // const d = {
    //   "Content-disposition": "attachment; filename=result.zip",
    //   "Content-type": "application/zip"
    // };
    // res.writeHead(200, { ...d, ...cors });
    // req.pipe(zzz.createGzip()).pipe(res);

    // зипование с помощью https://kodaktor.ru/zipper
    const d = {
      "Content-type": "application/zip",
      "Content-disposition": "attachment; filename=result.zip"
    };
    rs.writeHead(200, { ...d, ...cors });

    try {
      const z = zzz.createGzip();
      const busboy = new Busboy({
        headers: r.headers
      });
      z.on("error", e => rs.end("ERROR zip"));
      busboy
        .on("file", (_, file) => file.pipe(z).pipe(rs))
        .on("error", e => rs.end("ERROR boy"));
        .on("finish", () => r.pipe(busboy));
    } catch (e) {
      rs.end(e.stack);
    }
  } else {
    readStr("view/index.html").pipe(r.res);
    return;
  }
});
