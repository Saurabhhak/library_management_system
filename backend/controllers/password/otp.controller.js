const otpService = require("../../services/otp.service");
const sendEmail = require("../../services/admin/email.service");
const generateOtp = require("../../utils/generateOtp");

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }
    const otp = generateOtp();
    await otpService.saveOtp(email, otp); // fix
    await sendEmail(email, otp);

    return res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const isValid = await otpService.verifyOtp(email, otp);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    return res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
};
module.exports = { verifyOtp, sendOtp };
