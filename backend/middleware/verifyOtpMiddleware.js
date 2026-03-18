const pool = require("../config/db");

const verifyOtpMiddleware = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email & OTP required" });
    }
    const { rows } = await pool.query(
      "SELECT reset_otp, otp_expiry FROM admin WHERE email=$1",
      [email]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const { reset_otp, otp_expiry } = rows[0];

    if (String(reset_otp) !== String(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (!otp_expiry || new Date() > new Date(otp_expiry)) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    next();
  } catch (err) {
    console.error("verifyOtp error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = verifyOtpMiddleware;