const err = require("./error");
const nodemailer = require("nodemailer");
const config = require("../../../config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.sendMail.mail,
    pass: config.sendMail.password,
  },
});

const mailOptions = (mail, code) => {
  return {
    from: `${config.sendMail.mail}`,
    to: `${mail}`,
    subject: "Codigo de verificación - Reset password",
    text: `Tu codigo de verificación es: ${code}.`,
  };
};

function sendMail(mail, code) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions(mail, code), (error, info) => {
      if (error) {
        console.log("Estamos aca");
        return reject(error);
      } else {
        resolve("Se envio su mail");
      }
    });
  });
}

module.exports = sendMail;
