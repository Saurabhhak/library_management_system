const pool = require("../../config/db");
const sendEmail = require("../../services/admin/email.service");
const bcrypt = require("bcrypt");

// ---------------- FORGOT PASSWORD ----------------
const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    if (typeof email === "object") email = email?.email;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email required" });
    }

    email = email.trim().toLowerCase();

    const { rows } = await pool.query(
      "SELECT id FROM admin WHERE LOWER(email)=$1",
      [email],
    );

    // Hide existence (security)
    if (!rows.length) {
      return res.json({
        success: true,
        message: "If email exists, OTP will be sent",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = new Date(Date.now() + 2 * 60 * 1000);

    await pool.query(
      "UPDATE admin SET reset_otp=$1, otp_expiry=$2 WHERE LOWER(email)=$3",
      [otp, expiry, email],
    );

    await sendEmail(email, otp);

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("forgotPassword:", err.message);
    res.status(500).json({ success: false, message: "Try again later" });
  }
};

// ---------------- RESET PASSWORD ----------------

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
module.exports = { resetPassword, forgotPassword };
