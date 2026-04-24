// // controller
// const db = require("../../config/db"); 
// const checkEmailExists = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const existingUser = await db.query(
//       "SELECT * FROM admin WHERE email = $1",
//       [email]
//     );

//     if (existingUser.rows.length > 0) {
//       return res.status(200).json({
//         exists: true,
//         message: "Email already registered",
//       });
//     }

//     return res.status(200).json({
//       exists: false,
//     });
//   } catch (error) {
//     console.error("Check Email Error:", error);
//     return res.status(500).json({
//       message: "Server error",
//     });
//   }
// };
// module.exports = {checkEmailExists}

// ______________________________________________

// controllers/validations/checkEmailExists.controller.js
"use strict";

const db = require("../../config/db");

// POST /auth/check-email
const checkEmailExists = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    const { rows } = await db.query(
      "SELECT id FROM admin WHERE LOWER(email) = $1 AND is_deleted = FALSE",
      [email],
    );

    return res.status(200).json({
      exists:  rows.length > 0,
      message: rows.length > 0 ? "Email already registered" : "Email available",
    });
  } catch (err) {
    console.error("[checkEmailExists] error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { checkEmailExists };