const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (email, otp) => {
  try {

    await transporter.sendMail({
      from: `"APV Tech Library" <${process.env.EMAIL}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `<h2>Your OTP: ${otp}</h2>`
    });

    console.log("Email sent successfully");

  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
