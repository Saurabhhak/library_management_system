const otpService = require("../../services/validations/otp.service");
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const isValid = await otpService.verifyOtp(email, otp); // ✅ fix

    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    return res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
};
module.exports = { verifyOtp };
