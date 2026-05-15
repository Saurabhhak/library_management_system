// controllers/validations/otp.controller.js
"use strict";

const otpService = require("../../services/mail/otp.service");
const sendMail = require("../../services/mail/email.service");
const generateOtp = require("../../utils/generateOtp");
const { otpTemplate } = require("../../services/mail/templates");

// POST /auth/send-otp
const sendOtp = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email required" });

    const otp = generateOtp();
    await otpService.saveOtp(email, otp);

    await sendMail({
      to: email,
      subject: "Your Email Verification OTP — APV Library",
      html: otpTemplate(otp),
      text: `APV Library — Your OTP is: ${otp}\nExpires in 2 minutes.`,
    });

    return res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("[sendOtp] error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP" });
  }
};

// POST /auth/verify-otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP required" });

    const isValid = await otpService.verifyOtp(email, String(otp));
    if (!isValid)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });

    return res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error("[verifyOtp] error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Verification failed" });
  }
};

module.exports = { sendOtp, verifyOtp };
