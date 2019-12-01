const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });
const {createReadStream: readStr} = require("fs");
const mailTransport = nodemailer.createTransport({
  service: "gmail"
});

exports.mailer = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "POST") {
          readStr("./index.html").pipe(req.res);
      return; 
    }

    // const mailOptions = {
    //   from: req.body.email,
    //   replyTo: req.body.email,
    //   to: "quemsaurose@gmail.com",
    //   subject: `from my website ${req.body.email}`,
    //   text: req.body.message,
    //   html: `<p>${req.body.message}`
    // };
    console.log(JSON.stringify(req.body));

//    mailTransport.sendMail(mailOptions);

    res.status(200).end();
    // or you can pass data to indicate success.
    // res.status(200).send({isEmailSend: true});
  });
});
