"use strict";

const pool = require("../../config/db");
const bcrypt = require("bcrypt");

/* ----- "active"/"inactive" string → true/false for DB BOOLEAN column ----- */
const toBoolean = (val) => val === "active" || val === true;

const ALLOWED_ROLES = ["admin", "librarian", "staff"]; // superadmin: seed script only, never via API

/* _________________ Create admin (private — superadmin only) _________________ */
const createAdmin = async (req, res) => {
  const {
    first_name,
    last_name,
    dob,
    email,
    password,
    phone,
    state_id,
    city_id,
    role,
    is_active,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !dob ||
    !email ||
    !password ||
    !phone ||
    !state_id ||
    !city_id ||
    !role ||
    is_active === undefined ||
    is_active === null ||
    is_active === ""
  )
    return res
      .status(400)
      .json({ success: false, message: "Required fields missing" });

  if (!ALLOWED_ROLES.includes(role))
    return res
      .status(400)
      .json({
        success: false,
        message: `role must be one of: ${ALLOWED_ROLES.join(", ")}`,
      });

  try {
    const { rows: existingEmail } = await pool.query(
      "SELECT id FROM admin WHERE email=$1 AND is_deleted=false",
      [email],
    );
    if (existingEmail.length)
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });

    const { rows: existingPhone } = await pool.query(
      "SELECT id FROM admin WHERE phone=$1 AND is_deleted=false",
      [phone],
    );
    if (existingPhone.length)
      return res
        .status(409)
        .json({ success: false, message: "Phone already exists" });

    // NOTE: No OTP check — private staff creation by an already logged-in SuperAdmin/Admin.

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO admin
          (first_name, last_name, dob, email, password_hash, phone, state_id, city_id, role, is_active, email_verified)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING id, first_name, last_name, dob, email, phone, state_id, city_id, role, is_active`,
      [
        first_name,
        last_name,
        dob,
        email,
        hashedPassword,
        phone,
        state_id,
        city_id,
        role,
        toBoolean(is_active),
        true,
      ],
    );
    res
      .status(201)
      .json({
        success: true,
        message: "Admin created successfully",
        data: rows[0],
      });
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ________________ Get all admins ________________ */
const getAllAdmins = async (req, res) => {
  try {
    const { rows } = await pool.query(`
        SELECT a.id, a.first_name, a.last_name, a.dob, a.email, a.phone,
              s.name AS state, c.name AS city, a.role, a.is_active, a.is_online, a.last_seen
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

/*______________________  Get single admin______________________ */
const getAdminById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT id, first_name, last_name, dob, email, phone,
                state_id, city_id, role, is_active, is_online, last_seen
        FROM admin WHERE id=$1 AND is_deleted=false`,
      [id],
    );
    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Get admin by id error:", err);
    res.status(500).json({ success: false, message: "Fetch error" });
  }
};

/* _______________ Update admin (superadmin only) _______________ */
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    dob,
    email,
    password,
    phone,
    state_id,
    city_id,
    role,
    is_active,
  } = req.body;

  if (role && !ALLOWED_ROLES.includes(role))
    return res
      .status(400)
      .json({
        success: false,
        message: `role must be one of: ${ALLOWED_ROLES.join(", ")}`,
      });

  try {
    const { rows: dupEmail } = await pool.query(
      "SELECT id FROM admin WHERE email=$1 AND id<>$2 AND is_deleted=false",
      [email, id],
    );
    if (dupEmail.length)
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });

    const { rows: dupPhone } = await pool.query(
      "SELECT id FROM admin WHERE phone=$1 AND id<>$2 AND is_deleted=false",
      [phone, id],
    );
    if (dupPhone.length)
      return res
        .status(409)
        .json({ success: false, message: "Phone already exists" });

    const isActiveBool = toBoolean(is_active);
    let query, values;

    if (password?.trim()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = `UPDATE admin SET first_name=$1, last_name=$2, dob=$3, email=$4, password_hash=$5,
              phone=$6, state_id=$7, city_id=$8, role=$9, is_active=$10
          WHERE id=$11 AND is_deleted=false
          RETURNING id, first_name, last_name, dob, email, phone, state_id, city_id, role, is_active`;
      values = [
        first_name,
        last_name,
        dob,
        email,
        hashedPassword,
        phone,
        state_id,
        city_id,
        role,
        isActiveBool,
        id,
      ];
    } else {
      query = `UPDATE admin SET first_name=$1, last_name=$2, dob=$3, email=$4,
              phone=$5, state_id=$6, city_id=$7, role=$8, is_active=$9
          WHERE id=$10 AND is_deleted=false
          RETURNING id, first_name, last_name, dob, email, phone, state_id, city_id, role, is_active`;
      values = [
        first_name,
        last_name,
        dob,
        email,
        phone,
        state_id,
        city_id,
        role,
        isActiveBool,
        id,
      ];
    }

    const { rows } = await pool.query(query, values);
    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
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

/* ____________________ Delete admin (superadmin protected, soft delete) ____________________ */
const deleteAdmin = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT role FROM admin WHERE id=$1 AND is_deleted=false",
      [req.params.id],
    );
    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    if (rows[0].role === "superadmin")
      return res
        .status(403)
        .json({ success: false, message: "SuperAdmin cannot be deleted" });

    await pool.query(
      "UPDATE admin SET is_deleted=true, updated_at=NOW() WHERE id=$1",
      [req.params.id],
    );
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
