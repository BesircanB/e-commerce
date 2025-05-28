// server/services/emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false, // TLS kullanmak için true yapın (port 465)
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

async function sendMail({ to, subject, text, html }) {
  return transporter.sendMail({
    from: `"E-ticaret App" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text,
    html
  });
}

module.exports = { sendMail };
