"use strict";

const pool = require("../../config/db");
const bcrypt = require("bcrypt");

const VALID_MEMBER_TYPES = [
  "student",
  "teacher",
  "professor",
  "staff",
  "guest",
];

/* ════════════════════════════════════════════════════════════════
   1. PUBLIC REGISTRATION (For Guests - Requires OTP)
════════════════════════════════════════════════════════════════ */
const publicRegister = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const lEmail = email.toLowerCase();

    // 1. Verify OTP first
    const { rows: otpRows } = await pool.query(
      `SELECT id FROM otp_verifications WHERE LOWER(email) = $1 AND role = 'member' AND purpose = 'registration' AND is_verified = true ORDER BY id DESC LIMIT 1`,
      [lEmail],
    );
    if (!otpRows.length)
      return res
        .status(400)
        .json({ success: false, message: "Please verify OTP first" });

    // 2. Extra Security Check (in case user bypasses CheckEmail API)
    const { rows: existing } = await pool.query(
      "SELECT id, is_deleted, updated_at FROM members WHERE LOWER(email) = $1",
      [lEmail],
    );

    if (existing.length > 0) {
      if (existing[0].is_deleted === false) {
        return res
          .status(409)
          .json({ success: false, message: "Email already exists" });
      } else {
        const deletedAt = new Date(existing[0].updated_at);
        const permDeleteDate = new Date(
          deletedAt.getTime() + 15 * 24 * 60 * 60 * 1000,
        );
        const formattedDate = permDeleteDate.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        return res.status(403).json({
          success: false,
          message: `Account is pending deletion on ${formattedDate}. Please contact Support.`,
        });
      }
    }

    // 3. New User -> Insert safely
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO members (first_name, last_name, email, password, member_type, max_books_allowed, email_verified)
       VALUES ($1, $2, $3, $4, 'guest', 1, true) RETURNING id, first_name, email, member_type`,
      [first_name, last_name, lEmail, hashedPassword],
    );

    // 4. Clear used OTP
    await pool.query(
      "DELETE FROM otp_verifications WHERE LOWER(email)=$1 AND role='member' AND purpose='registration'",
      [lEmail],
    );

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("[publicRegister]", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ════════════════════════════════════════════════════════════════
   2. ADMIN CREATES MEMBER (For Students/Professors - NO OTP)
════════════════════════════════════════════════════════════════ */
const createMemberByAdmin = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      member_type,
      enrollment_no,
      department,
      max_books_allowed,
    } = req.body;

    if (!VALID_MEMBER_TYPES.includes(member_type)) {
      return res
        .status(400)
        .json({ success: false, message: `Invalid member type` });
    }

    const lEmail = email.toLowerCase();

    // Check if account already exists or is in recycle bin
    const { rows: existing } = await pool.query(
      "SELECT id, is_deleted FROM members WHERE LOWER(email) = $1",
      [lEmail],
    );

    if (existing.length > 0) {
      if (existing[0].is_deleted === false) {
        return res
          .status(409)
          .json({ success: false, message: "Email already exists" });
      } else {
        // Admin ke liye Smart Message
        return res.status(409).json({
          success: false,
          message:
            "This user is currently in the Recycle Bin. Please go to 'Restore Delete Accounts' page to restore them.",
        });
      }
    }

    const booksLimit =
      max_books_allowed || (member_type === "professor" ? 10 : 3);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Completely New User -> Insert
    try {
      const { rows } = await pool.query(
        `INSERT INTO members (first_name, last_name, email, password, phone, member_type, enrollment_no, department, max_books_allowed, email_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
         RETURNING id, first_name, email, member_type, enrollment_no`,
        [
          first_name,
          last_name,
          lEmail,
          hashedPassword,
          phone || null,
          member_type,
          enrollment_no || null,
          department || null,
          booksLimit,
        ],
      );
      return res.status(201).json({
        success: true,
        message: "Member added successfully",
        data: rows[0],
      });
    } catch (err) {
      if (err.code === "23505") {
        const field = err.detail.includes("email")
          ? "Email"
          : "Enrollment Number";
        return res
          .status(409)
          .json({ success: false, message: `${field} already exists.` });
      }
      throw err;
    }
  } catch (error) {
    console.error("[createMemberByAdmin]", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ════════════════════════════════════════════════════════════════
   3. GET ALL MEMBERS (Admin View)
════════════════════════════════════════════════════════════════ */
const getMembers = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT m.id, m.first_name, m.last_name, m.email, m.phone, m.member_type, m.status,
             m.enrollment_no, m.department, s.name AS state, c.name AS city
      FROM members m
      LEFT JOIN states s ON m.state_id = s.id
      LEFT JOIN cities c ON m.city_id = c.id
      WHERE m.is_deleted = false ORDER BY m.id DESC
    `);
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error("[getMembers]", error.message);
    return res.status(500).json({ success: false, message: "Fetch error" });
  }
};

/* Keep your existing getMemberById, updateMember, deleteMember here */
const getMemberById = async (req, res) => {
  /* Your old code */
};
const updateMember = async (req, res) => {
  /* Your old code, just add enrollment_no & department in SQL */
};
const deleteMember = async (req, res) => {
  /* Your old code */
};

module.exports = {
  publicRegister,
  createMemberByAdmin,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
};
