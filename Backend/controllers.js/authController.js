const dotenv = require("dotenv").config();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const postData = async (req, res) => {
  try {
    const { name, gmail, password, phone, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO admin (name,gmail,password,phone,address)
            VALUES ($1,$2,$3,$4,$5) RETURNING*`,
      [name, gmail, hashedPassword, phone, address],
    );
    res.status(201).json({
      success: true,
      message: "Admin User added successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", success: false });
  }
};
//---- Get Data from DB
const getData = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM admin`);
    res.status(200).json({
      message: "data get successfully",
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "fail to fetch server error",
      success: false,
    });
  }
};
// Updated Logic
const putData = async (req, res) => {
  const { id } = req.params;
  const { name, gmail, password, phone, address } = req.body;
  try {
    const result = await pool.query(
      `UPDATE admin SET name = $1, gmail=$2, password=$3, phone=$4, address=$5 WHERE id=$6 RETURNING*`,
      [name, gmail, password, phone, address, id],
    );
    res.status(200).json({
      message: "Admin Updated successfully",
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: " server error could'nt updated your data",
      success: false,
    });
  }
};
//---- Delete Users
const delData = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM admin WHERE id = $1 RETURNING *`,
      [id],
    );
    res.status(200).json({
      message: "admin deleted successfully",
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: " server error could'nt delete your data",
      cuccess: false,
    });
  }
};

// ---- login user
const loginAdmin = async (req, res) => {
  const { gmail, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM admin WHERE gmail = $1", [
      gmail,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid password", success: false });
    }
    // Create JWT Token
    const token = jwt.sign(
      { id: user.id, gmail: user.gmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    //  SEND RESPONSE
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};
module.exports = { postData, getData, putData, delData, loginAdmin };
