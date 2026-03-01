const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
      role = "admin",
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO admin
       (first_name, last_name, email, password_hash, phone, state_id, city_id, role)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id, first_name, last_name, email, phone, state_id, city_id, role`,
      [
        first_name,
        last_name,
        email,
        hashedPassword,
        phone,
        state_id,
        city_id,
        role,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Admin User added successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
//---- Get Data from DB
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

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Fetch error",
    });
  }
};
// Updated Logic
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
    let query;
    let values;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);

      query = `
        UPDATE admin
        SET first_name=$1,last_name=$2,email=$3,
            password_hash=$4,phone=$5,state_id=$6,city_id=$7,role=$8
        WHERE id=$9 RETURNING *`;

      values = [
        first_name,
        last_name,
        email,
        hashed,
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
        WHERE id=$8 RETURNING *`;

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

    res.status(200).json({
      success: true,
      message: "Admin updated",
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
//---- Delete Users
const delData = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM admin WHERE id=$1 RETURNING *",
      [id],
    );

    res.json({
      success: true,
      message: "Admin deleted",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete error" });
  }
};

// ---- login user
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM admin WHERE email = $1", [
      email,
    ]);

    if (!result.rows.length) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
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
// ---- profile section
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
  loginAdmin,
  profileAdmin,
};
