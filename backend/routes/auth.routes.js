"use strict";

const router = require("express").Router();
const auth = require("../middleware/auth.middleware"); // ← path change: authenticate → auth.middleware
const authCtrl = require("../controllers/auth/auth.controller");
const otpCtrl = require("../controllers/auth/otp.controller");
const pwdCtrl = require("../controllers/auth/password.controller");

/* ── Public — role-less, auto-detected ── */
router.post("/login", authCtrl.login);
router.post("/refresh", authCtrl.refresh);
router.post("/check-email", authCtrl.checkEmail);
router.post("/send-otp", otpCtrl.sendOtp);
router.post("/verify-otp", otpCtrl.verifyOtp);
router.post("/forgot-password", pwdCtrl.forgotPassword);
router.post("/reset-password", pwdCtrl.resetPassword);

/* ── Protected — variable name "auth" everywhere, matches other route files ── */
router.post("/logout", auth, authCtrl.logout);
router.get("/profile", auth, authCtrl.profile);
router.put("/profile", auth, authCtrl.updateProfile);
router.post("/change-password", auth, authCtrl.changePassword);
router.post("/heartbeat", auth, authCtrl.heartbeat);

module.exports = router;
