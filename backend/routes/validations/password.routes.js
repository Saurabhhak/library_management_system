const express = require("express");
const router = express.Router();

const {
  forgotPassword,
} = require("../../controllers/validations/forgotpassword.controller");
const {
  resetPassword,
} = require("../../controllers/validations/resetpassword.controller");
const { sendOtp } = require("../../controllers/validations/sendotp.controller");
const {
  verifyOtp,
} = require("../../controllers/validations/verifyotp.controller");
// ================= PASSWORD RESET =================

router.post("/forgot-password", forgotPassword);

// Step 1 → Send OTP
router.post("/send-otp", sendOtp);

// Step 2 → Verify OTP
router.post("/verify-otp", verifyOtp);

// Step 3 → Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;
