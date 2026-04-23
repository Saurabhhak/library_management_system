const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ─────────────────────────────────────────
   HELPER: stamp last_seen (called on every
   meaningful action: login, logout, heartbeat)
───────────────────────────────────────── */
const stampSeen = (id) =>
  pool.query("UPDATE admin SET last_seen = NOW() WHERE id = $1", [id]);

/* ─────────────────────────────────────────
   LOGIN
───────────────────────────────────────── */
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    /* User Check By Email */
    const { rows } = await pool.query(
      "SELECT * FROM admin WHERE email = $1 AND is_deleted = false",
      [email],
    );
    /* Check Email Or Password */
    if (
      !rows.length ||
      !(await bcrypt.compare(password, rows[0].password_hash))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    /* Check user is Not Active Config */
    const user = rows[0];
    if (!user.is_active)
      return res.status(403).json({
        success: false,
        message: "Account is inactive. Contact SuperAdmin.",
      });

    if (!process.env.JWT_SECRET)
      return res
        .status(500)
        .json({ success: false, message: "Server misconfigured" });

    /* Stamp last_seen on login */
    await stampSeen(user.id);
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ─────────────────────────────────────────
   LOGOUT
───────────────────────────────────────── */
const logoutAdmin = async (req, res) => {
  try {
    // Stamp last_seen so the "last seen" time is accurate after logout
    await stampSeen(req.user.id);
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ success: false, message: "Logout error" });
  }
};

/* ─────────────────────────────────────────
   HEARTBEAT  ← NEW
   Frontend pings this every 30s while active.
   This keeps last_seen fresh → we derive
   online/offline from it instead of a boolean.
   Route: POST /api/admin/heartbeat  (auth required)
───────────────────────────────────────── */
const heartbeat = async (req, res) => {
  try {
    await stampSeen(req.user.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Heartbeat error:", err);
    res.status(500).json({ success: false });
  }
};

/* ─────────────────────────────────────────
   PROFILE
───────────────────────────────────────── */
const profileAdmin = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.id, a.first_name, a.last_name, a.email, a.phone,
              s.name AS state, c.name AS city, a.role, a.last_seen
       FROM admin a
       LEFT JOIN states s ON a.state_id = s.id
       LEFT JOIN cities c ON a.city_id = c.id
       WHERE a.id = $1`,
      [req.user.id],
    );
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ success: false, message: "Profile fetch error" });
  }
};

/* ─────────────────────────────────────────
   DELETE OWN ACCOUNT
───────────────────────────────────────── */
const deleteOwnAccount = async (req, res) => {
  try {
    await pool.query("DELETE FROM admin WHERE id = $1", [req.user.id]);
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ success: false, message: "Delete error" });
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  heartbeat,
  profileAdmin,
  deleteOwnAccount,
};
