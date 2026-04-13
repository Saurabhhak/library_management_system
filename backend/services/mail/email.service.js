// utils/sendMail.js

const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");

const sendMail = async ({ to, subject, html }) => {
  try {
    //  PRIMARY: SendGrid
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      await sgMail.send({
        to,
        from: process.env.EMAIL_FROM,
        subject,
        html,
      });

      console.log("Sent via SendGrid");
      return;
    }

    //  FALLBACK: Nodemailer
    if (process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
      });

      console.log("Sent via Nodemailer");
      return;
    }

    throw new Error("No mail provider configured");

  } catch (err) {
    console.error("❌ Mail error:", err.message);
    throw err;
  }
};

module.exports = sendMail;