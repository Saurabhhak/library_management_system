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

const createMember = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      member_type = "guest",
    } = req.body;

    if (!first_name || !last_name || !email || !password)
      return res
        .status(400)
        .json({
          success: false,
          message: "first_name, last_name, email and password are required",
        });

    if (!VALID_MEMBER_TYPES.includes(member_type))
      return res
        .status(400)
        .json({
          success: false,
          message: `member_type must be one of: ${VALID_MEMBER_TYPES.join(", ")}`,
        });

    const lEmail = email.toLowerCase();

    const { rows: existing } = await pool.query(
      "SELECT id FROM members WHERE LOWER(email)=$1 AND is_deleted=false",
      [lEmail],
    );
    if (existing.length)
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });

    const { rows: otpRows } = await pool.query(
      `SELECT id FROM otp_verifications
       WHERE LOWER(email) = $1 AND role = 'member' AND purpose = 'registration' AND is_verified = true
       ORDER BY id DESC LIMIT 1`,
      [lEmail],
    );
    if (!otpRows.length)
      return res
        .status(400)
        .json({ success: false, message: "Please verify OTP first" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO members (first_name, last_name, email, password, phone, member_type, email_verified)
       VALUES ($1,$2,$3,$4,$5,$6,true)
       RETURNING id, first_name, last_name, email, member_type, status`,
      [
        first_name,
        last_name,
        lEmail,
        hashedPassword,
        phone || null,
        member_type,
      ],
    );

    await pool.query(
      "DELETE FROM otp_verifications WHERE LOWER(email)=$1 AND role='member' AND purpose='registration'",
      [lEmail],
    );

    res
      .status(201)
      .json({
        success: true,
        message: "Member registered successfully",
        data: rows[0],
      });
  } catch (error) {
    console.error("[createMember]", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getMembers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.id, m.first_name, m.last_name, m.email, m.phone, m.member_type, m.status,
             s.name AS state, c.name AS city, m.membership_start, m.membership_end
      FROM members m
      LEFT JOIN states s ON m.state_id = s.id
      LEFT JOIN cities c ON m.city_id = c.id
      WHERE m.is_deleted = false
      ORDER BY m.id DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("[getMembers]", error.message);
    res.status(500).json({ success: false, message: "Fetch error" });
  }
};

const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, phone, member_type, status,
              state_id, city_id, membership_start, membership_end, max_books_allowed
       FROM members WHERE id=$1 AND is_deleted=false`,
      [id],
    );
    if (!result.rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("[getMemberById]", error.message);
    res.status(500).json({ success: false, message: "Fetch error" });
  }
};

const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      first_name,
      last_name,
      phone,
      member_type,
      state_id,
      city_id,
      membership_end,
      status,
      max_books_allowed,
    } = req.body;

    if (member_type && !VALID_MEMBER_TYPES.includes(member_type))
      return res
        .status(400)
        .json({
          success: false,
          message: `member_type must be one of: ${VALID_MEMBER_TYPES.join(", ")}`,
        });

    state_id = Number(state_id) || null;
    city_id = Number(city_id) || null;
    max_books_allowed = Number(max_books_allowed) || 3;
    membership_end = membership_end || null;

    const result = await pool.query(
      `UPDATE members SET first_name=$1, last_name=$2, phone=$3, member_type=$4, state_id=$5, city_id=$6,
        membership_end=$7, status=$8, max_books_allowed=$9, updated_at=NOW()
       WHERE id=$10 AND is_deleted=false
       RETURNING id, first_name, last_name, phone, member_type, status`,
      [
        first_name,
        last_name,
        phone,
        member_type,
        state_id,
        city_id,
        membership_end,
        status,
        max_books_allowed,
        id,
      ],
    );

    if (!result.rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    res.json({
      success: true,
      message: "Member updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("[updateMember]", error.message);
    res.status(500).json({ success: false, message: "Update error" });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE members SET is_deleted=true, updated_at=NOW() WHERE id=$1 RETURNING id`,
      [id],
    );
    if (!result.rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    res.json({ success: true, message: "Member deleted successfully" });
  } catch (error) {
    console.error("[deleteMember]", error.message);
    res.status(500).json({ success: false, message: "Delete error" });
  }
};

module.exports = {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
};
