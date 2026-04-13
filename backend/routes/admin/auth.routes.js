const router = require("express").Router();
const { loginAdmin } = require("../../controllers/admin/auth.controller");
const {
  sendOtp,
  verifyOtp,
} = require("../../controllers/validations/otp.controller");
const {
  checkEmailExists,
} = require("../../controllers/validations/checkEmailExists.controller");

router.post("/login", loginAdmin);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/check-email", checkEmailExists);

module.exports = router;
