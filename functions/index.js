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

exports.zipper = functions.https.onRequest((r, res) => {
  if (r.method == "POST") {
    var busboy = new Busboy({ headers: r.headers });
    busboy.on("file", function(fieldname, file, filename, encoding, mimetype) {
      console.log(
        "File [" +
          fieldname +
          "]: filename: " +
          filename +
          ", encoding: " +
          encoding +
          ", mimetype: " +
          mimetype
      );
      file.on("data", function(data) {
        console.log("File [" + fieldname + "] got " + data.length + " bytes");
      });
      file.on("end", function() {
        console.log("File [" + fieldname + "] Finished");
      });
    });
    busboy.on("finish", function() {
      console.log("Done parsing form!");
      res.writeHead(303, { Connection: "close", Location: "/" });
      res.end();
    });
    r.pipe(busboy);
  } else {
    readStr("view/index.html").pipe(r.res);
    return;
  }
});
