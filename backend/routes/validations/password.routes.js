const express = require("express");
const router = express.Router();

const {
  forgotPassword,
  resetPassword,
} = require("../../controllers/validations/password.controller");

const {
  sendOtp,
  verifyOtp,
} = require("../../controllers/validations/otp.controller");
// ================= PASSWORD RESET =================

router.post("/forgot-password", forgotPassword);

// Step 1 → Send OTP
router.post("/send-otp", sendOtp);

// Step 2 → Verify OTP
router.post("/verify-otp", verifyOtp);

// Step 3 → Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;
