const db = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ─────────────────────────────────────────────────────────────────
   GENERATE JWT TOKEN
───────────────────────────────────────────────────────────────── */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

/* ─────────────────────────────────────────────────────────────────
   GET PROFILE
   GET /api/admin/profile
───────────────────────────────────────────────────────────────── */
const getProfile = async (req, res) => {
  try {
    const adminId = req.user.id;

    const result = await db.query(
      `SELECT id, email, role, first_name, last_name, phone,
              state_id, city_id, is_profile_complete, created_at
       FROM admin
       WHERE id = $1 AND is_deleted = false`,
      [adminId],
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("[getProfile] Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

/* ─────────────────────────────────────────────────────────────────
   UPDATE PROFILE
   PUT /api/admin/update-profile
───────────────────────────────────────────────────────────────── */
const updateProfile = async (req, res) => {
  try {
    const adminId = req.user.id;

    const { first_name, last_name, phone, state_id, city_id, password } =
      req.body;

    // Optional password update
    let password_hash = null;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }
      password_hash = await bcrypt.hash(password, 10);
    }

    const result = await db.query(
      `UPDATE admin
       SET first_name = COALESCE($1, first_name),
           last_name  = COALESCE($2, last_name),
           phone      = COALESCE($3, phone),
           state_id   = COALESCE($4, state_id),
           city_id    = COALESCE($5, city_id),
           password_hash = COALESCE($6, password_hash),
           updated_at = NOW()
       WHERE id = $7 AND is_deleted = false
       RETURNING id, email, role, first_name, last_name, phone,
                 state_id, city_id, is_profile_complete`,
      [first_name, last_name, phone, state_id, city_id, password_hash, adminId],
    );

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("[updateProfile] Error:", error);
    res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};

/* ─────────────────────────────────────────────────────────────────
   DELETE ACCOUNT (SOFT DELETE)
   DELETE /api/admin/delete-account
───────────────────────────────────────────────────────────────── */
const deleteAccount = async (req, res) => {
  try {
    const adminId = req.user.id;

    await db.query(
      `UPDATE admin
       SET is_deleted = true,
           updated_at = NOW()
       WHERE id = $1`,
      [adminId],
    );

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("[deleteAccount] Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};

/* ─────────────────────────────────────────────────────────────────
   LOGIN ADMIN
───────────────────────────────────────────────────────────────── */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await db.query(
      "SELECT * FROM admin WHERE LOWER(email) = $1 AND is_deleted = false",
      [email.trim().toLowerCase()],
    );

    if (!result.rows.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = result.rows[0];

    if (!user.password_hash) {
      return res.status(400).json({
        success: false,
        message: "Please login using Google",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_profile_complete: user.is_profile_complete,
      },
    });
  } catch (error) {
    console.error("[loginAdmin] Error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

/* ─────────────────────────────────────────────────────────────────
   COMPLETE PROFILE
───────────────────────────────────────────────────────────────── */
const completeProfile = async (req, res) => {
  try {
    const { first_name, last_name, phone, state_id, city_id } = req.body;
    const adminId = req.user.id;

    if (!phone || !state_id || !city_id) {
      return res.status(400).json({
        success: false,
        message: "phone, state_id and city_id are required",
      });
    }

    const result = await db.query(
      `UPDATE admin
       SET first_name          = COALESCE($1, first_name),
           last_name           = COALESCE($2, last_name),
           phone               = $3,
           state_id            = $4,
           city_id             = $5,
           is_profile_complete = true,
           updated_at          = NOW()
       WHERE id = $6
       RETURNING id, email, role, is_profile_complete`,
      [first_name, last_name, phone, state_id, city_id, adminId],
    );

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("[completeProfile] Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete profile",
    });
  }
};

module.exports = {
  generateToken,
  loginAdmin,
  completeProfile,
  getProfile,
  updateProfile,
  deleteAccount,
};
