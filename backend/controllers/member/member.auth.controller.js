const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ── Member Login ───────────────────────────────────────────────── */
const memberLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });

  try {
    const { rows } = await pool.query(
      "SELECT * FROM members WHERE email=$1 AND is_deleted=false",
      [email],
    );

    const member = rows[0];
    if (!member)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });

    if (member.status !== "active")
      return res
        .status(403)
        .json({
          success: false,
          message: "Your account is inactive. Contact support.",
        });

    const valid = await bcrypt.compare(password, member.password);
    if (!valid)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });

    const token = jwt.sign(
      { id: member.id, email: member.email, role: "member" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      success: true,
      message: "Login successful.",
      token,
      data: {
        id: member.id,
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email,
        role: "member",
      },
    });
  } catch (err) {
    console.error("[MemberAuth] login:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/* ── Check email uniqueness before OTP send ─────────────────────── */
const checkMemberEmail = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "Email is required." });

  try {
    const { rows } = await pool.query(
      "SELECT id FROM members WHERE email=$1 AND is_deleted=false",
      [email],
    );
    res.json({ success: true, exists: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { memberLogin, checkMemberEmail };
