const express = require("express");
const router = express.Router();

const { loginAdmin } = require("../../controllers/admin/auth.controller");
const { sendOtp } = require("../../controllers/validations/sendotp.controller");
const {
  verifyOtp,
} = require("../../controllers/validations/verifyotp.controller");
const {
  checkEmailExists,
} = require("../..//controllers/validations/checkEmailExists.controller");
router.post("/login", loginAdmin);

// _____________ OTP ROUTES_________________
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// __________ Check Email Exists route ______
router.post("/check-email", checkEmailExists);
module.exports = router;
