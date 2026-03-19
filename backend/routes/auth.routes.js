const express = require("express");
const router = express.Router();

const { loginAdmin } = require("../controllers/auth.controller");
const { sendOtp, verifyOtp } = require("../controllers/otp.controller");
const { checkEmailExists } = require("../controllers/checkEmailExists.controller")
router.post("/login", loginAdmin);

// FIXED ROUTES
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
// Check Email Exists route
router.post("/check-email", checkEmailExists);
module.exports = router;