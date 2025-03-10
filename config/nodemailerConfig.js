const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "musicfinderoficial@gmail.com", // Reemplázalo con tu correo electrónico
    pass: "imvp owiq yecq kmqd",      // Reemplázalo con tu contraseña de correo
  },
});

module.exports = transporter;
