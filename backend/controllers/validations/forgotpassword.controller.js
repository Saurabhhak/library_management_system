const pool = require("../../config/db");
const sendEmail = require("../../services/mail/email.service");
const bcrypt = require("bcrypt");

// _________________________ FORGOT PASSWORD _________________________
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
module.exports = {forgotPassword}
