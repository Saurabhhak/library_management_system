const pool = require("../config/db");

const verifyOtpMiddleware = async (req, res, next) => {
  try {

    const { email, otp } = req.body;

    const result = await pool.query(
      "SELECT reset_otp, otp_expiry FROM admin WHERE email=$1",
      [email]
    );

    const admin = result.rows[0];

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    // OTP check
    if (String(admin.reset_otp) !== String(otp)) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // OTP expiry check
    if (new Date() > admin.otp_expiry) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    next();

  } catch (error) {

    console.error("OTP Middleware Error:", error);

    res.status(500).json({
      message: "Server error",
    });

  }
};

module.exports = verifyOtpMiddleware;
