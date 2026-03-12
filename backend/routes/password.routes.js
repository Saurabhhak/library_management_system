const express = require("express");

const router = express.Router();

const {
  forgotPassword,
  resetPassword
} = require("../controllers/password.controller");

const verifyOtpMiddleware = require("../middleware/verifyOtpMiddleware");


/*
 SEND OTP
 POST /api/password/forgot-password
*/
router.post("/forgot-password", forgotPassword);


/*
 VERIFY OTP + RESET PASSWORD
*/
router.post(
  "/reset-password",
  verifyOtpMiddleware,
  resetPassword
);

module.exports = router;
