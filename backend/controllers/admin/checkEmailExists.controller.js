// controllers/auth/checkEmail.controller.js

const db = require("../../config/db");

/*
|--------------------------------------------------------------------------
| CHECK EMAIL EXISTS
|--------------------------------------------------------------------------
| Used during registration/invite to check email availability
|--------------------------------------------------------------------------
*/
const checkEmailExists = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check email in DB
    const result = await db.query(
      "SELECT id FROM admin WHERE LOWER(email) = $1",
      [email.trim().toLowerCase()],
    );

    if (result.rows.length > 0) {
      return res.json({
        success: true,
        exists: true,
        message: "Email already registered",
      });
    }

    return res.json({
      success: true,
      exists: false,
      message: "Email available",
    });
  } catch (error) {
    console.error("Check Email Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { checkEmailExists };
