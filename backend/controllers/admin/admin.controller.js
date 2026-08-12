"use strict";

const pool = require("../../config/db");
const bcrypt = require("bcrypt");

const toBoolean = (val) => val === "active" || val === true;

// Allow superadmin creation/updating for future scaling
const ALLOWED_ROLES = ["superadmin", "admin", "librarian", "staff"];

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
    is_active === undefined
  ) {
    return res
      .status(400)
      .json({
        success: false,
        message: "All required fields must be provided",
      });
  }

  if (!ALLOWED_ROLES.includes(role)) {
    return res
      .status(400)
      .json({
        success: false,
        message: `Role must be one of: ${ALLOWED_ROLES.join(", ")}`,
      });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO admin 
        (first_name, last_name, dob, email, password_hash, phone, state_id, city_id, role, is_active, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
       RETURNING id, first_name, last_name, dob, email, phone, state_id, city_id, role, is_active`,
      [
        first_name,
        last_name,
        dob,
        email.toLowerCase(),
        hashedPassword,
        phone,
        state_id,
        city_id,
        role,
        toBoolean(is_active),
      ],
    );

    return res
      .status(201)
      .json({
        success: true,
        message: "Admin created successfully",
        data: rows[0],
      });
  } catch (err) {
    if (err.code === "23505") {
      const duplicateField = err.detail.includes("email")
        ? "Email"
        : "Phone number";
      return res
        .status(409)
        .json({
          success: false,
          message: `${duplicateField} already exists in the system`,
        });
    }
    console.error("[createAdmin error]:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error while creating admin" });
  }
};

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
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("[getAllAdmins error]:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch admins" });
  }
};

const getAdminById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, first_name, last_name, dob, email, phone, state_id, city_id, role, is_active, is_online, last_seen
       FROM admin WHERE id = $1 AND is_deleted = false`,
      [req.params.id],
    );

    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("[getAdminById error]:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch admin details" });
  }
};

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

  if (role && !ALLOWED_ROLES.includes(role)) {
    return res
      .status(400)
      .json({
        success: false,
        message: `Role must be one of: ${ALLOWED_ROLES.join(", ")}`,
      });
  }

  try {
    const isActiveBool = toBoolean(is_active);
    let query, values;

    if (password?.trim()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = `UPDATE admin SET first_name=$1, last_name=$2, dob=$3, email=$4, password_hash=$5, phone=$6, state_id=$7, city_id=$8, role=$9, is_active=$10
               WHERE id=$11 AND is_deleted=false 
               RETURNING id, first_name, last_name, dob, email, phone, role, is_active`;
      values = [
        first_name,
        last_name,
        dob,
        email.toLowerCase(),
        hashedPassword,
        phone,
        state_id,
        city_id,
        role,
        isActiveBool,
        id,
      ];
    } else {
      query = `UPDATE admin SET first_name=$1, last_name=$2, dob=$3, email=$4, phone=$5, state_id=$6, city_id=$7, role=$8, is_active=$9
               WHERE id=$10 AND is_deleted=false 
               RETURNING id, first_name, last_name, dob, email, phone, role, is_active`;
      values = [
        first_name,
        last_name,
        dob,
        email.toLowerCase(),
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
        .json({ success: false, message: "Admin not found or deleted" });

    return res.json({
      success: true,
      message: "Admin updated successfully",
      data: rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      const duplicateField = err.detail.includes("email")
        ? "Email"
        : "Phone number";
      return res
        .status(409)
        .json({
          success: false,
          message: `${duplicateField} is already used by another account`,
        });
    }
    console.error("[updateAdmin error]:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update admin" });
  }
};

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
    return res.json({ success: true, message: "Admin deleted successfully" });
  } catch (err) {
    console.error("[deleteAdmin error]:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete admin" });
  }
};

const getDeletedAdmins = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, first_name, last_name, email, role, phone, updated_at 
      FROM admin WHERE is_deleted = true
      UNION ALL
      SELECT id, first_name, last_name, email, 'member' AS role, phone, updated_at 
      FROM members WHERE is_deleted = true
      ORDER BY updated_at DESC
    `);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("[getDeletedAdmins error]:", err);
    return res.status(500).json({ success: false, message: "Fetch error" });
  }
};

const restoreAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    let result = await pool.query(
      `UPDATE admin SET is_deleted = false, is_active = true, updated_at = NOW() 
       WHERE id = $1 AND is_deleted = true RETURNING id, first_name, email`,
      [id],
    );

    if (!result.rows.length) {
      result = await pool.query(
        `UPDATE members SET is_deleted = false, status = 'active', updated_at = NOW() 
         WHERE id = $1 AND is_deleted = true RETURNING id, first_name, email`,
        [id],
      );
    }

    if (!result.rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Account not found or restored." });

    return res.json({
      success: true,
      message: "Account restored successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("[restoreAdmin error]:", err);
    return res.status(500).json({ success: false, message: "Restore error" });
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getDeletedAdmins,
  restoreAdmin,
};
