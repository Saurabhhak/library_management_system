const pool = require("../../config/db");
const bcrypt = require("bcrypt");

// ─── Create admin ─────────────────────────────────────────
const createAdmin = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone,
    state_id,
    city_id,
    role,
  } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Required fields missing" });
  }

  try {
    // Duplicate email check
    const { rows: existing } = await pool.query(
      "SELECT id FROM admin WHERE email=$1 AND is_deleted=false",
      [email],
    );
    if (existing.length) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    // OTP must be verified before account creation
    const { rows: otpRows } = await pool.query(
      `SELECT id FROM otp_verifications
       WHERE email=$1 AND is_verified=true
       ORDER BY id DESC LIMIT 1`,
      [email],
    );
    if (!otpRows.length) {
      return res
        .status(400)
        .json({ success: false, message: "Please verify OTP first" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO admin
         (first_name, last_name, email, password_hash, phone, state_id, city_id, role, email_verified)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, first_name, last_name, email, phone, state_id, city_id, role`,
      [
        first_name,
        last_name,
        email,
        hashedPassword,
        phone,
        state_id,
        city_id,
        role || "admin",
        true,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: rows[0],
    });
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── Get all admins ───────────────────────────────────────
const getAllAdmins = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT a.id, a.first_name, a.last_name, a.email, a.phone,
             s.name AS state, c.name AS city, a.role, a.is_active
      FROM admin a
      LEFT JOIN states s ON a.state_id = s.id
      LEFT JOIN cities c ON a.city_id = c.id
      WHERE a.is_deleted = false
      ORDER BY a.id DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Get admins error:", err);
    res.status(500).json({ success: false, message: "Fetch error" });
  }
};

// ─── Get single admin ─────────────────────────────────────
const getAdminById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        id,first_name,last_name,email,
        phone,state_id,city_id,role
      FROM admin
      WHERE id=$1`,
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fetch error",
    });
  }
};

// ─── Update admin ─────────────────────────────────────────
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    email,
    password,
    phone,
    state_id,
    city_id,
    role,
  } = req.body;

  try {
    // Duplicate email check (exclude current record)
    const { rows: dup } = await pool.query(
      "SELECT id FROM admin WHERE email=$1 AND id<>$2 AND is_deleted=false",
      [email, id],
    );
    if (dup.length) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    let query, values;

    if (password?.trim()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = `
        UPDATE admin
        SET first_name=$1, last_name=$2, email=$3, password_hash=$4,
            phone=$5, state_id=$6, city_id=$7, role=$8
        WHERE id=$9
        RETURNING id, first_name, last_name, email, phone, state_id, city_id, role`;
      values = [
        first_name,
        last_name,
        email,
        hashedPassword,
        phone,
        state_id,
        city_id,
        role,
        id,
      ];
    } else {
      query = `
        UPDATE admin
        SET first_name=$1, last_name=$2, email=$3,
            phone=$4, state_id=$5, city_id=$6, role=$7
        WHERE id=$8
        RETURNING id, first_name, last_name, email, phone, state_id, city_id, role`;
      values = [
        first_name,
        last_name,
        email,
        phone,
        state_id,
        city_id,
        role,
        id,
      ];
    }

    const { rows } = await pool.query(query, values);

    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    res.json({
      success: true,
      message: "Admin updated successfully",
      data: rows[0],
    });
  } catch (err) {
    console.error("Update admin error:", err);
    res.status(500).json({ success: false, message: "Update error" });
  }
};

// ─── Delete admin (hard delete, no superadmin allowed) ────
const deleteAdmin = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT role FROM admin WHERE id=$1 AND is_deleted=false",
      [req.params.id],
    );

    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    if (rows[0].role === "superadmin") {
      return res
        .status(403)
        .json({ success: false, message: "SuperAdmin cannot be deleted" });
    }

    await pool.query("DELETE FROM admin WHERE id=$1", [req.params.id]);

    res.json({ success: true, message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Delete admin error:", err);
    res.status(500).json({ success: false, message: "Delete error" });
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
