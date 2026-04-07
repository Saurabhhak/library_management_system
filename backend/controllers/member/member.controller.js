const pool = require("../../config/db");
const bcrypt = require("bcrypt");

/* ---------------- CREATE MEMBER ---------------- */
const createMember = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      password,
      state_id,
      city_id,
      date_of_birth,
      membership_end,
      max_books_allowed,
    } = req.body;

    // Duplicate email check
    const emailCheck = await pool.query(
      "SELECT id FROM members WHERE email=$1",
      [email],
    );

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO members
      (first_name,last_name,email,phone,password,date_of_birth,state_id,city_id,membership_end,max_books_allowed)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id,first_name,last_name,email,phone,status`,
      [
        first_name,
        last_name,
        email,
        phone,
        hashedPassword,
        date_of_birth,
        state_id,
        city_id,
        membership_end,
        max_books_allowed || 3,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ---------------- GET ALL MEMBERS ---------------- */
const getMembers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.id,
        m.first_name,
        m.last_name,
        m.email,
        m.phone,
        m.status,
        s.name AS state,
        c.name AS city,
        m.membership_start,
        m.membership_end
      FROM members m
      LEFT JOIN states s ON m.state_id = s.id
      LEFT JOIN cities c ON m.city_id = c.id
      WHERE m.is_deleted=false
      ORDER BY m.id DESC
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch error" });
  }
};

/* ---------------- GET MEMBER BY ID ---------------- */
const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM members WHERE id=$1 AND is_deleted=false`,
      [id],
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch error" });
  }
};

/* ---------------- UPDATE MEMBER ---------------- */
const updateMember = async (req, res) => {
  try {
    const { id } = req.params;

    let {
      first_name,
      last_name,
      phone,
      state_id,
      city_id,
      membership_end,
      status,
      max_books_allowed,
    } = req.body;

    //  Convert types
    state_id = Number(state_id) || null;
    city_id = Number(city_id) || null;
    max_books_allowed = Number(max_books_allowed) || 3;
    membership_end = membership_end || null;

    const result = await pool.query(
      `UPDATE members SET
        first_name=$1,
        last_name=$2,
        phone=$3,
        state_id=$4,
        city_id=$5,
        membership_end=$6,
        status=$7,
        max_books_allowed=$8,
        updated_at=NOW()
      WHERE id=$9 AND is_deleted=false
      RETURNING id,first_name,last_name,phone,status`,
      [
        first_name,
        last_name,
        phone,
        state_id,
        city_id,
        membership_end,
        status,
        max_books_allowed,
        id,
      ],
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.json({
      success: true,
      message: "Member updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error); // VERY IMPORTANT
    res.status(500).json({
      success: false,
      message: error.message, // show real error
    });
  }
};
/* ---------------- DELETE (SOFT DELETE) ---------------- */
const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE members 
       SET is_deleted=true, updated_at=NOW()
       WHERE id=$1
       RETURNING id`,
      [id],
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
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
