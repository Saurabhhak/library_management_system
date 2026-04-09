const db = require("../config/db");

const checkBootstrap = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id FROM admin WHERE role = 'superadmin' AND is_deleted = false LIMIT 1`
    );
    return res.json({
      success: true,
      bootstrap_needed: result.rows.length === 0,
    });
  } catch (err) {
    console.error("[checkBootstrap] Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Browser-friendly: redirects instead of returning JSON
const bootstrapGuard = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT id FROM admin WHERE role = 'superadmin' AND is_deleted = false LIMIT 1`
    );

    if (result.rows.length > 0) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=bootstrap_complete`
      );
    }

    next();
  } catch (err) {
    console.error("[bootstrapGuard] Error:", err);
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};

module.exports = { checkBootstrap, bootstrapGuard };