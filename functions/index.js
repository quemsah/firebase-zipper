const functions = require("firebase-functions");
const { createReadStream: readStr } = require("fs");
const zlib = require("zlib");
const Busboy = require("busboy");
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers":
    "cors,my,Content-Type,Accept,Access-Control-Allow-Headers"
};

exports.zipper = functions.https.onRequest((req, res) => {
  if (req.method !== "POST") {
    readStr("view/index.html").pipe(req.res);
    return;
  } else {
    console.log("1");
    const d = {
      "Content-type": "application/zip",
      "Content-disposition": "attachment; filename=result.zip"
    };
    console.log("2");
    res.writeHead(200, {
      ...d,
      ...cors
    });
    console.log("3");
    const z = zlib.createGzip();
    console.log("4");
    const busboy = new Busboy({
      headers: req.headers
    });
    console.log("5");
    z.on("error", e => res.end("ERROR zip"));
    console.log("6");
    busboy
      .on("file", (_, file) => file.pipe(z).pipe(res))
      .on("error", e => res.end("ERROR boy"));
    console.log("7");
    req.pipe(busboy);
    console.log("8");
  }
});
