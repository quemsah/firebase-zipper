const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });
const { createReadStream: readStr } = require("fs");
const mailTransport = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  port: 25,
  auth: { user: "quemsaurose2@gmail.com", pass: "" },
  tls: { rejectUnauthorized: false }
});
exports.mailer = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "POST") {
      readStr("./index.html").pipe(req.res);
      return;
    }
    const mailOptions = {
      from: "quemsaurose2@gmail.com",
      replyTo: "quemsaurose2@gmail.com",
      to: "quemsaurose@gmail.com",
      subject: `from my website ${req.body.email}`,
      text: req.body.message,
      html: `<p>${req.body.message}`
    };
    console.log("TCL: mailOptions", JSON.stringify(mailOptions));
    mailTransport.sendMail(mailOptions);
    res.status(200).end();
  });
});
