const pool = require("../config/db");
const bcrypt = require("bcrypt");
// ------------------- Create Admin ---------------------/
const createAdmin = async (req, res) => {
  try {
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
    // Check if email already exists
    const emailCheck = await pool.query("SELECT id FROM admin WHERE email=$1", [
      email,
    ]);

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO admin
      (first_name,last_name,email,password_hash,phone,state_id,city_id,role)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id,first_name,last_name,email,phone,state_id,city_id,role`,
      [
        first_name,
        last_name,
        email,
        hashedPassword,
        phone,
        state_id,
        city_id,
        role || "admin",
      ],
    );

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ------------------- Get All Admin -----------------/
const getAllAdmins = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.id,
        a.first_name,
        a.last_name,
        a.email,
        a.phone,
        s.name AS state,
        c.name AS city,
        a.role,
        a.is_active
      FROM admin a
      LEFT JOIN states s ON a.state_id = s.id
      LEFT JOIN cities c ON a.city_id = c.id
      ORDER BY a.id DESC
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Fetch error",
    });
  }
};
// ------------------ Get Single Admin -----------------/
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
// ------------------ Update Admin ------------------/
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
    // check duplicate email except current user
    const emailCheck = await pool.query(
      "SELECT id FROM admin WHERE email=$1 AND id<>$2",
      [email, id],
    );

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    let query;
    let values;
    // If password provided → update password
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);

      query = `
      UPDATE admin
      SET first_name=$1,last_name=$2,email=$3,
      password_hash=$4,phone=$5,state_id=$6,city_id=$7,role=$8
      WHERE id=$9
      RETURNING id,first_name,last_name,email,phone,state_id,city_id,role`;

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
      SET first_name=$1,last_name=$2,email=$3,
      phone=$4,state_id=$5,city_id=$6,role=$7
      WHERE id=$8
      RETURNING id,first_name,last_name,email,phone,state_id,city_id,role`;

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

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: "Admin updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Update error",
    });
  }
};

// ------------------- Delete Admin By Id ----------------

const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const check = await pool.query("SELECT role FROM admin WHERE id=$1", [id]);

    if (!check.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (check.rows[0].role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "SuperAdmin cannot be deleted",
      });
    }

    await pool.query("DELETE FROM admin WHERE id=$1", [id]);

    res.json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Delete error",
    });
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
