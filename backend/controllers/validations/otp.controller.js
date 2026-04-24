// const otpService = require("../../services/mail/otp.service");
// const sendEmail = require("../../services/mail/email.service");
// const generateOtp = require("../../utils/generateOtp");

// const sendOtp = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email required" });
//     }
//     const otp = generateOtp();
//     await otpService.saveOtp(email, otp);
//     await sendEmail(email, otp);

//     return res.json({ success: true, message: "OTP sent" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to send OTP" });
//   }
// };

// const verifyOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const isValid = await otpService.verifyOtp(email, otp); 

//     if (!isValid) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }
//     return res.json({ success: true, message: "OTP verified" });
//   } catch (err) {
//     res.status(500).json({ message: "Verification failed" });
//   }
// };
// module.exports = { verifyOtp, sendOtp };

// ______________________________________________________________________
// controllers/validations/otp.controller.js
"use strict";

const otpService  = require("../../services/mail/otp.service");
const sendEmail   = require("../../services/mail/email.service");
const { generateOtp } = require("../../utils/generateOtp"); // named import ✓

// POST /auth/send-otp
const sendOtp = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    const otp = generateOtp();
    await otpService.saveOtp(email, otp);
    await sendEmail(email, otp);

    return res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("[sendOtp] error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// POST /auth/verify-otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP required" });
    }

    const isValid = await otpService.verifyOtp(email, otp);

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    return res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error("[verifyOtp] error:", err.message);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};

module.exports = { sendOtp, verifyOtp };