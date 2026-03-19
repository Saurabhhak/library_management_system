const express = require("express");
const router = express.Router();
const passwordController = require("../controllers/password.controller");
const verifyOtpMiddleware = require("../middleware/verifyOtpMiddleware");

// ---- forgot-password & Send OTP 
router.post("/forgot-password", passwordController.forgotPassword);

// ---- Verify OTP & Reset Password
router.post("/reset-password", verifyOtpMiddleware, passwordController.resetPassword);

module.exports = router;