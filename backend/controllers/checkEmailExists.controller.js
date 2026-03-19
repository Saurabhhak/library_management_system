// controller
const db = require("../config/db"); 
const checkEmailExists = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await db.query(
      "SELECT * FROM admin WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(200).json({
        exists: true,
        message: "Email already registered",
      });
    }

    return res.status(200).json({
      exists: false,
    });
  } catch (error) {
    console.error("Check Email Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {checkEmailExists}