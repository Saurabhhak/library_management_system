const pool = require("../../config/db");
const sendEmail = require("../../services/mail/email.service");
const generateOtp = require("../../utils/generateOtp");
const bcrypt = require("bcrypt");

// POST /password/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email required" });
    }

    const { rows } = await pool.query(
      "SELECT id FROM admin WHERE LOWER(email) = $1 AND is_deleted = FALSE",
      [email],
    );

    // Security: never reveal whether the email exists
    if (!rows.length) {
      return res.json({
        success: true,
        message: "If that email exists, an OTP has been sent",
      });
    }

    const otp = generateOtp();
    const expiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    await pool.query(
      "UPDATE admin SET reset_otp = $1, reset_otp_expiry = $2 WHERE LOWER(email) = $3",
      [otp, expiry, email],
    );

    await sendEmail(email, otp);
    return res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("forgotPassword error:", err.message);
    return res.status(500).json({ success: false, message: "Try again later" });
  }
};

// POST /password/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const { rows } = await pool.query(
      `SELECT id FROM admin
       WHERE LOWER(email) = $1
         AND reset_otp = $2
         AND reset_otp_expiry > NOW()
         AND is_deleted = FALSE`,
      [email.toLowerCase(), otp],
    );

    if (!rows.length) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE admin
       SET password_hash = $1, reset_otp = NULL, reset_otp_expiry = NULL, updated_at = NOW()
       WHERE LOWER(email) = $2`,
      [hash, email.toLowerCase()],
    );

    return res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("resetPassword error:", err.message);
    return res.status(500).json({ success: false, message: "Reset failed" });
  }
};
