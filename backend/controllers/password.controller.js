const pool = require("../config/db");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt")
//  SEND OTP TO EMAIL
//  POST /api/password/forgot-password

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await pool.query(
      "SELECT * FROM admin WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // OTP expiry 2 minutes
    const expiry = new Date(Date.now() + 2 * 60 * 1000);

    await pool.query(
      `UPDATE admin
       SET reset_otp=$1, otp_expiry=$2
       WHERE email=$3`,
      [otp, expiry, email]
    );

    // Send OTP to email
    await sendEmail(email, otp);

    res.json({
      message: "OTP sent to your email",
    });

  } catch (error) {

    console.error("Forgot Password Error:", error);

    res.status(500).json({
      message: "Server error",
    });

  }
};

//  RESET PASSWORD
//  POST /api/password/reset-password

exports.resetPassword = async (req, res) => {
  try {

    const { email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE admin SET password_hash=$1 WHERE email=$2`,
      [hashed, email]
    );

    res.json({
      message: "Password reset successful",
    });

  } catch (error) {

    console.error("Reset Password Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
