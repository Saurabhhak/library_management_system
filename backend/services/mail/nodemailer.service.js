// email-nodemailer.js
// Fallback provider — Nodemailer via Gmail SMTP
// Completely free, no account limits | https://nodemailer.com
//
// Gmail App Password setup (REQUIRED — do NOT use your real Gmail password):
//   1. Go to myaccount.google.com → Security
//   2. Enable 2-Step Verification if not already on
//   3. Search "App passwords" → create one → name it "APV Library"
//   4. Copy the 16-character password shown (e.g. "abcd efgh ijkl mnop")
//   5. Use that as SMTP_PASS — spaces are fine, Gmail ignores them
//
// Other SMTP providers:
//   Outlook: smtp-mail.outlook.com  port 587
//   Yahoo:   smtp.mail.yahoo.com    port 465  (set secure: true)
//   Zoho:    smtp.zoho.com          port 587
//
// npm install nodemailer
//
// .env required:
//   SMTP_HOST=smtp.gmail.com
//   SMTP_PORT=587
//   SMTP_USER=you@gmail.com
//   SMTP_PASS=abcd efgh ijkl mnop
//   SMTP_FROM="APV Library" <you@gmail.com>

const nodemailer = require("nodemailer");

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465", // true only for port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const getTemplate = (otp) => `
  <div style="font-family:Arial;max-width:600px;margin:auto;padding:20px">
    <h2>Password Reset OTP</h2>
    <p>Your OTP is:</p>
    <div style="padding:15px;background:#f4f4f4;text-align:center;font-size:24px">
      <b>${otp}</b>
    </div>
    <p>Expires in 2 minutes</p>
  </div>
`;

const sendEmail = async (toEmail, otp) => {
  const transporter = createTransporter();
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"APV Library" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Password Reset OTP",
      html: getTemplate(otp),
    });
    console.log(`[Nodemailer] OTP sent to ${toEmail} | id: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("[Nodemailer] EMAIL ERROR:", error.message);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;