"use strict";

const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Purely B2B Institutional Types (No public/guest/staff allowed here)
const VALID_MEMBER_TYPES = ["student", "teacher", "professor"];

/* ── HELPER: Auto Generate Institutional ID ── */
const generateInstitutionalId = (type) => {
  const prefix = type === "student" ? "STU" : "FAC";
  const year = new Date().getFullYear();
  const randomStr = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${prefix}-${year}-${randomStr}`;
};

/* ── 1. ENROLL INSTITUTIONAL MEMBER (Admin Only) ── */
const enrollInstitutionalMember = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      member_type,
      institutional_id,
      course,
      batch_year,
      designation,
      department,
    } = req.body;

    if (!first_name || !last_name || !email || !member_type) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing." });
    }

    if (!VALID_MEMBER_TYPES.includes(member_type)) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Invalid member type. Allowed: ${VALID_MEMBER_TYPES.join(", ")}`,
        });
    }

    const lEmail = email.toLowerCase();

    // Check if email already exists or is in recycle bin
    const { rows: existingEmail } = await pool.query(
      "SELECT id, is_deleted FROM members WHERE LOWER(email) = $1",
      [lEmail],
    );

    if (existingEmail.length > 0) {
      if (!existingEmail[0].is_deleted)
        return res
          .status(409)
          .json({
            success: false,
            message: "This email is already registered.",
          });
      else
        return res
          .status(409)
          .json({
            success: false,
            message:
              "This email is currently in the Recycle Bin. Please restore it.",
          });
    }

    // Determine Institutional ID (Use provided, or auto-generate if blank)
    const finalInstId =
      institutional_id && institutional_id.trim() !== ""
        ? institutional_id.trim()
        : generateInstitutionalId(member_type);

    // Set Book Limits
    const booksLimit =
      member_type === "professor" || member_type === "teacher" ? 10 : 3;

    // Default Password Logic (Phone last 4 digits or 12345)
    const defaultRawPassword = phone
      ? `Lib@${String(phone).slice(-4)}`
      : "Lib@12345";
    const hashedPassword = await bcrypt.hash(defaultRawPassword, 10);

    try {
      const { rows } = await pool.query(
        `INSERT INTO members (
          first_name, last_name, email, password, phone, member_type, 
          institutional_id, course, batch_year, designation, department, 
          max_books_allowed, email_verified
        )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true)
         RETURNING id, first_name, email, member_type, institutional_id`,
        [
          first_name,
          last_name,
          lEmail,
          hashedPassword,
          phone || null,
          member_type,
          finalInstId,
          course || null,
          batch_year || null,
          designation || null,
          department || null,
          booksLimit,
        ],
      );

      return res.status(201).json({
        success: true,
        message: "Institutional Member enrolled successfully.",
        data: { ...rows[0], generated_password: defaultRawPassword },
      });
    } catch (err) {
      if (err.code === "23505")
        return res
          .status(409)
          .json({
            success: false,
            message: "Institutional ID already exists.",
          });
      throw err;
    }
  } catch (error) {
    console.error("[enrollInstitutionalMember Error]:", error.message);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

/* ── 2. GET ALL MEMBERS (Admin Inventory) ── */
const getMembers = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        id, first_name, last_name, email, phone, member_type, status,
        institutional_id, course, batch_year, designation, department
      FROM members
      WHERE is_deleted = false 
      ORDER BY id DESC
    `);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("[getMembers Error]:", error.message);
    return res
      .status(500)
      .json({
        success: false,
        message: "Database error while fetching members.",
      });
  }
};

/* ── 3. GET SINGLE MEMBER (Cleaned: No old columns) ── */
const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT 
          id, first_name, last_name, email, phone, member_type, status,
          institutional_id, course, batch_year, designation, department,
          max_books_allowed
       FROM members 
       WHERE id = $1 AND is_deleted = false`,
      [id],
    );

    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("[getMemberById Error]:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch member details" });
  }
};

/* ── 4. UPDATE MEMBER (Cleaned: Synchronized with B2B Schema) ── */
const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      first_name,
      last_name,
      phone,
      status,
      max_books_allowed,
      institutional_id,
      course,
      batch_year,
      designation,
      department,
    } = req.body;

    const { rows } = await pool.query(
      `UPDATE members SET
        first_name = $1, 
        last_name = $2, 
        phone = $3, 
        status = $4, 
        max_books_allowed = $5,
        institutional_id = $6, 
        course = $7, 
        batch_year = $8, 
        designation = $9, 
        department = $10, 
        updated_at = NOW()
       WHERE id = $11 AND is_deleted = false
       RETURNING id, first_name, last_name, institutional_id`,
      [
        first_name,
        last_name,
        phone || null,
        status,
        Number(max_books_allowed) || 3,
        institutional_id || null,
        course || null,
        batch_year || null,
        designation || null,
        department || null,
        id,
      ],
    );

    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    return res.json({
      success: true,
      message: "Member updated successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("[updateMember Error]:", error.message);
    return res.status(500).json({ success: false, message: "Update error" });
  }
};

/* ── 5. SOFT DELETE MEMBER ── */
const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `UPDATE members SET is_deleted=true, updated_at=NOW() WHERE id=$1 AND is_deleted=false RETURNING id`,
      [id],
    );
    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    return res.json({ success: true, message: "Member moved to recycle bin" });
  } catch (error) {
    console.error("[deleteMember Error]:", error.message);
    return res.status(500).json({ success: false, message: "Delete error" });
  }
};

module.exports = {
  enrollInstitutionalMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
};
