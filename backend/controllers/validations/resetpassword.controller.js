const pool = require("../../config/db");
const bcrypt = require("bcrypt");

// ______________________ RESET PASSWORD ______________________

const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const { rows } = await pool.query(
      "SELECT id FROM admin WHERE LOWER(email)=$1 AND reset_otp=$2 AND otp_expiry > NOW()",
      [email.toLowerCase(), otp],
    );

    if (!rows.length) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid/Expired OTP" });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE admin SET password_hash=$1, reset_otp=NULL, otp_expiry=NULL WHERE LOWER(email)=$2",
      [hash, email.toLowerCase()],
    );

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("resetPassword:", err.message);
    res.status(500).json({ success: false, message: "Reset failed" });
  }
};
module.exports = { resetPassword };
