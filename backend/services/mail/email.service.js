const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: 587,
  secure: false,
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
  try {
    const info = await transporter.sendMail({
      from: `"APV Library" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Your OTP Code",
      html: getTemplate(otp),
    });

    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw error;
  }
};

module.exports = sendEmail;
