// controllers/auth.controller.js
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//  ---------------- login Admin ---------------- //
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const result = await pool.query("SELECT * FROM admin WHERE email=$1", [
      email,
    ]);

    if (!result.rows.length) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const user = result.rows[0];

    // Check if account active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Account inactive",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Create JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Login error",
    });
  }
};
// ----------------- Get Profile Of Logged-In Admin ------------------ //
const profileAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        a.id,
        a.first_name,
        a.last_name,
        a.email,
        a.phone,
        s.name AS state,
        c.name AS city,
        a.role
      FROM admin a
      LEFT JOIN states s ON a.state_id = s.id
      LEFT JOIN cities c ON a.city_id = c.id
      WHERE a.id = $1
      `,
      [req.user.id],
    );

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Profile error",
    });
  }
};

// --------------------  Delete Own Account -------------------- //

const deleteOwnAccount = async (req, res) => {
  try {
    const id = req.user.id;

    await pool.query("DELETE FROM admin WHERE id=$1", [id]);

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Delete account error",
    });
  }
};

module.exports = {
  loginAdmin,
  profileAdmin,
  deleteOwnAccount,
};
