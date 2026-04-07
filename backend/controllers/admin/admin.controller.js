const db = require("../../config/db");

/* -------------------------------------------------------------------------- */
/* GET ALL ADMINS (SuperAdmin) */
/* -------------------------------------------------------------------------- */
const getAllAdmins = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, first_name, last_name, email, phone, role, is_active, created_at
      FROM admin
      WHERE is_deleted = false
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("Fetch Admins Error:", err);
    res.status(500).json({ success: false, message: "Fetch error" });
  }
};

/* -------------------------------------------------------------------------- */
/* GET ADMIN BY ID */
/* -------------------------------------------------------------------------- */
const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT id, first_name, last_name, email, phone, role, state_id, city_id
       FROM admin
       WHERE id = $1 AND is_deleted = false`,
      [id],
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Fetch Admin Error:", err);
    res.status(500).json({ success: false, message: "Fetch error" });
  }
};

/* -------------------------------------------------------------------------- */
/* UPDATE ADMIN */
/* -------------------------------------------------------------------------- */
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, role, state_id, city_id } = req.body;

    await db.query(
      `UPDATE admin
       SET first_name=$1, last_name=$2, phone=$3, role=$4, state_id=$5, city_id=$6
       WHERE id=$7`,
      [first_name, last_name, phone, role, state_id, city_id, id],
    );

    res.json({
      success: true,
      message: "Admin updated successfully",
    });
  } catch (err) {
    console.error("Update Admin Error:", err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

/* -------------------------------------------------------------------------- */
/* DELETE ADMIN (SuperAdmin) */
/* -------------------------------------------------------------------------- */
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const check = await db.query("SELECT role FROM admin WHERE id=$1", [id]);

    if (!check.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (check.rows[0].role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete SuperAdmin",
      });
    }

    // Soft delete
    await db.query("UPDATE admin SET is_deleted = true WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "Admin deleted",
    });
  } catch (err) {
    console.error("Delete Admin Error:", err);
    res.status(500).json({ success: false, message: "Delete error" });
  }
};

/* -------------------------------------------------------------------------- */
/* GET PROFILE (LOGGED-IN ADMIN) */
/* -------------------------------------------------------------------------- */
const profileAdmin = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.id, a.first_name, a.last_name, a.email, a.phone,
              s.name AS state, c.name AS city,
              a.role, a.is_profile_complete
       FROM admin a
       LEFT JOIN states s ON a.state_id = s.id
       LEFT JOIN cities c ON a.city_id = c.id
       WHERE a.id = $1`,
      [req.user.id],
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
    console.error("Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

/* -------------------------------------------------------------------------- */
/* DELETE OWN ACCOUNT */
/* -------------------------------------------------------------------------- */
const deleteOwnAccount = async (req, res) => {
  try {
    await db.query("UPDATE admin SET is_deleted = true WHERE id = $1", [
      req.user.id,
    ]);

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};

module.exports = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  profileAdmin,
  deleteOwnAccount,
};
