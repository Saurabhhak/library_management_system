// services/admin/email.service.js

const nodemailer = require("nodemailer");

/*
|--------------------------------------------------------------------------
| Create Mail Transporter (Reusable)
|--------------------------------------------------------------------------
| Uses Gmail App Password from .env
|--------------------------------------------------------------------------
*/
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/*
|--------------------------------------------------------------------------
| Send Email Function
|--------------------------------------------------------------------------
*/
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Library Management System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: html.replace(/<[^>]*>?/gm, ""), // Fallback text version
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;