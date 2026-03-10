const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// ---- Create Admin
const postData = async (req, res) => {
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
    // Check email already exists
    const emailCheck = await pool.query("SELECT id FROM admin WHERE email=$1", [
      email,
    ]);

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

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

// ---- Get All Admin
const getData = async (req, res) => {
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

// ---- Update Admin
const putData = async (req, res) => {
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

// ---------------- DELETE ADMIN BY ID ----------------

const delData = async (req, res) => {
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

// ---------------- DELETE OWN ACCOUNT ----------------

const deleteOwnAccount = async (req, res) => {
  try {
    const id = req.user.id;

    await pool.query("DELETE FROM admin WHERE id=$1", [id]);

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Delete account error",
    });
  }
};

// ---- Get Single Admin
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

// ---- Login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM admin WHERE email=$1", [
      email,
    ]);

    if (!result.rows.length) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Account inactive",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Login error",
    });
  }
};

// ---- Profile
const profileAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        a.id,
        a.first_name,
        a.last_name,
        a.email,
        a.phone,
        s.name AS state,
        c.name AS city,
        a.role
      FROM admin a
      LEFT JOIN states s ON a.state_id = s.id
      LEFT JOIN cities c ON a.city_id = c.id
      WHERE a.id = $1
    `,
      [req.user.id],
    );

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Profile error",
    });
  }
};

module.exports = {
  postData,
  getData,
  putData,
  delData,
  deleteOwnAccount,
  loginAdmin,
  profileAdmin,
  getAdminById,
};
