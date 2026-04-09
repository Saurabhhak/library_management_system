const otpService = require("../../services/validations/otp.service");
const sendEmail = require("../../services/mail/email.service");
const generateOtp = require("../../utils/generateOtp");

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }
    const otp = generateOtp();
    await otpService.saveOtp(email, otp);   // fix
    await sendEmail(email, otp);

    return res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};
module.exports = { sendOtp };