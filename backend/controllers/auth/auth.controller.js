"use strict";

const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const {
  signAccessToken,
  generateRefreshToken,
  hashToken,
  refreshExpiresAt,
} = require("../../utils/token");

/* ════════════════════════════════════════════════════════════════
   PRIVATE HELPERS
════════════════════════════════════════════════════════════════ */
const findUserByEmail = async (email) => {
  const { rows: adminRows } = await pool.query(
    `SELECT id, first_name, last_name, email,
            password_hash AS pwd,
            CASE WHEN is_active THEN 'active' ELSE 'inactive' END AS active_flag,
            role
     FROM admin
     WHERE LOWER(email) = $1 AND is_deleted = false`,
    [email],
  );
  if (adminRows.length) return { ...adminRows[0], userType: "admin" };

  const { rows: memberRows } = await pool.query(
    `SELECT id, first_name, last_name, email,
            password AS pwd,
            status   AS active_flag,
            'member' AS role
     FROM members
     WHERE LOWER(email) = $1 AND is_deleted = false`,
    [email],
  );
  if (memberRows.length) return { ...memberRows[0], userType: "member" };

  return null;
};

/** Hashed opaque refresh token DB me save karo (cookie kahi nahi). */
const saveRefreshToken = (userId, userType, rawToken, req) =>
  pool.query(
    `INSERT INTO refresh_tokens
       (user_id, user_type, token_hash, expires_at, ip_address, user_agent)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [
      userId,
      userType,
      hashToken(rawToken),
      refreshExpiresAt(),
      req.ip,
      req.headers["user-agent"] ?? null,
    ],
  );

/* ════════════════════════════════════════════════════════════════
   POST /api/auth/login
   Body: { email, password }
   Response: { success, data: { accessToken, refreshToken, user } }
════════════════════════════════════════════════════════════════ */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "email and password are required" });

  try {
    const user = await findUserByEmail(email.toLowerCase());

    if (!user || !(await bcrypt.compare(password, user.pwd)))
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    if (user.active_flag !== "active")
      return res.status(403).json({
        success: false,
        message: "Account inactive. Contact support.",
      });

    if (user.userType === "admin")
      await pool.query(
        "UPDATE admin SET last_seen = NOW(), is_online = true WHERE id = $1",
        [user.id],
      );

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      userType: user.userType, // ← AuthContext isse decode karke padhta hai
    };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken();

    await saveRefreshToken(user.id, user.userType, refreshToken, req);

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken, // ← body me, koi Set-Cookie nahi
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    console.error("[auth:login]", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ════════════════════════════════════════════════════════════════
   POST /api/auth/refresh
   Body: { refreshToken }
   Response: { success, data: { accessToken, refreshToken } }
════════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════════
   POST /api/auth/refresh
   Body: { refreshToken }
   Response: { success, data: { accessToken, refreshToken } }
════════════════════════════════════════════════════════════════ */
exports.refresh = async (req, res) => {
  const rawToken = req.body?.refreshToken;
  if (!rawToken)
    return res
      .status(401)
      .json({ success: false, message: "No refresh token" });

  try {
    // NOTE: is_revoked filter hata diya — revoked token bhi fetch karna hai
    // taaki reuse (theft) detect kar sakein.
    const { rows } = await pool.query(
      `SELECT * FROM refresh_tokens WHERE token_hash = $1`,
      [hashToken(rawToken)],
    );

    if (!rows.length)
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });

    const rt = rows[0];

    /* ── Reuse / theft detection ──────────────────────────────────
       Agar ye token pehle se revoked hai (matlab already rotate ho
       chuka tha) aur phir bhi use ho raha hai → kisi ne ise chura
       kar use karne ki koshish ki. Is user ke SAARE refresh tokens
       revoke karo, force re-login. */
    if (rt.is_revoked) {
      await pool.query(
        "UPDATE refresh_tokens SET is_revoked = true WHERE user_id=$1 AND user_type=$2",
        [rt.user_id, rt.user_type],
      );
      return res.status(401).json({
        success: false,
        message: "Session invalidated. Please log in again.",
      });
    }

    if (new Date(rt.expires_at) <= new Date())
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });

    let user;
    if (rt.user_type === "member") {
      const { rows: r } = await pool.query(
        "SELECT id, email, 'member' AS role FROM members WHERE id = $1 AND is_deleted = false",
        [rt.user_id],
      );
      user = r[0];
    } else {
      const { rows: r } = await pool.query(
        "SELECT id, email, role FROM admin WHERE id = $1 AND is_deleted = false",
        [rt.user_id],
      );
      user = r[0];
    }

    if (!user) {
      await pool.query(
        "UPDATE refresh_tokens SET is_revoked = true WHERE id = $1",
        [rt.id],
      );
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // Rotation: purana revoke, naya issue
    await pool.query(
      "UPDATE refresh_tokens SET is_revoked = true WHERE id = $1",
      [rt.id],
    );

    const newRefreshToken = generateRefreshToken();
    await saveRefreshToken(user.id, rt.user_type, newRefreshToken, req);

    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      userType: rt.user_type,
    });

    return res.json({
      success: true,
      data: { accessToken, refreshToken: newRefreshToken },
    });
  } catch (err) {
    console.error("[auth:refresh]", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ════════════════════════════════════════════════════════════════
   POST /api/auth/logout   (auth required)
   Body: { refreshToken }
════════════════════════════════════════════════════════════════ */
exports.logout = async (req, res) => {
  const rawToken = req.body?.refreshToken;
  try {
    if (rawToken)
      await pool.query(
        "UPDATE refresh_tokens SET is_revoked = true WHERE token_hash = $1",
        [hashToken(rawToken)],
      );

    if (req.user?.role !== "member")
      await pool.query(
        "UPDATE admin SET last_seen = NOW(), is_online = false WHERE id = $1",
        [req.user.id],
      );

    return res.json({ success: true, message: "Logged out" });
  } catch (err) {
    console.error("[auth:logout]", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ════════════════════════════════════════════════════════════════
   GET /api/auth/profile   (auth required) — UNCHANGED from original
════════════════════════════════════════════════════════════════ */
exports.profile = async (req, res) => {
  try {
    let user;

    if (req.user.role === "member") {
      const { rows } = await pool.query(
        `SELECT m.id, m.first_name, m.last_name, m.email, m.phone,
                m.date_of_birth, s.name AS state, c.name AS city,
                m.membership_start, m.membership_end,
                m.max_books_allowed, m.status, 'member' AS role
         FROM members m
         LEFT JOIN states s ON m.state_id = s.id
         LEFT JOIN cities c ON m.city_id  = c.id
         WHERE m.id = $1 AND m.is_deleted = false`,
        [req.user.id],
      );
      user = rows[0];
    } else {
      const { rows } = await pool.query(
        `SELECT a.id, a.first_name, a.last_name, a.email, a.phone,
                s.name AS state, c.name AS city,
                a.role, a.last_seen, a.is_online
         FROM admin a
         LEFT JOIN states s ON a.state_id = s.id
         LEFT JOIN cities c ON a.city_id  = c.id
         WHERE a.id = $1 AND a.is_deleted = false`,
        [req.user.id],
      );
      user = rows[0];
    }

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.json({ success: true, user });
  } catch (err) {
    console.error("[auth:profile]", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ════════════════════════════════════════════════════════════════
   POST /api/auth/check-email   (public) — UNCHANGED
════════════════════════════════════════════════════════════════ */
exports.checkEmail = async (req, res) => {
  const { email, role } = req.body;

  if (!email || !["admin", "member"].includes(role))
    return res
      .status(400)
      .json({ success: false, message: "email and valid role required" });

  try {
    const table = role === "admin" ? "admin" : "members";
    const { rows } = await pool.query(
      `SELECT id FROM ${table} WHERE LOWER(email) = $1 AND is_deleted = false`,
      [email.toLowerCase()],
    );
    return res.json({ success: true, exists: rows.length > 0 });
  } catch (err) {
    console.error("[auth:checkEmail]", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ════════════════════════════════════════════════════════════════
   POST /api/auth/heartbeat   (auth required) — UNCHANGED
════════════════════════════════════════════════════════════════ */
exports.heartbeat = async (req, res) => {
  try {
    if (req.user.role !== "member")
      await pool.query("UPDATE admin SET last_seen = NOW() WHERE id = $1", [
        req.user.id,
      ]);
    return res.json({ success: true });
  } catch (err) {
    console.error("[auth:heartbeat]", err.message);
    return res.status(500).json({ success: false });
  }
};

/* ════════════════════════════════════════════════════════════════
   PUT /api/auth/profile   (auth required) — UNCHANGED
════════════════════════════════════════════════════════════════ */
exports.updateProfile = async (req, res) => {
  const { first_name, last_name, phone } = req.body;
  if (!first_name || !last_name)
    return res.status(400).json({
      success: false,
      message: "first_name and last_name are required",
    });

  try {
    if (req.user.role === "member") {
      const { rows } = await pool.query(
        `UPDATE members SET first_name=$1, last_name=$2, phone=COALESCE($3, phone), updated_at=NOW()
         WHERE id=$4 AND is_deleted=false
         RETURNING id, first_name, last_name, email, phone, member_type, status`,
        [first_name, last_name, phone || null, req.user.id],
      );
      if (!rows.length)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      return res.json({
        success: true,
        message: "Profile updated",
        user: rows[0],
      });
    }

    const { rows } = await pool.query(
      `UPDATE admin SET first_name=$1, last_name=$2, phone=COALESCE($3, phone), updated_at=NOW()
       WHERE id=$4 AND is_deleted=false
       RETURNING id, first_name, last_name, email, phone, role`,
      [first_name, last_name, phone || null, req.user.id],
    );
    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    return res.json({
      success: true,
      message: "Profile updated",
      user: rows[0],
    });
  } catch (err) {
    console.error("[auth:updateProfile]", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ════════════════════════════════════════════════════════════════
   POST /api/auth/change-password   (auth required) — UNCHANGED
════════════════════════════════════════════════════════════════ */
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({
      success: false,
      message: "currentPassword and newPassword are required",
    });
  if (newPassword.length < 8)
    return res.status(400).json({
      success: false,
      message: "New password must be at least 8 characters",
    });

  try {
    const isMember = req.user.role === "member";
    const table = isMember ? "members" : "admin";
    const pwdCol = isMember ? "password" : "password_hash";

    const { rows } = await pool.query(
      `SELECT ${pwdCol} AS pwd FROM ${table} WHERE id=$1 AND is_deleted=false`,
      [req.user.id],
    );
    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const valid = await bcrypt.compare(currentPassword, rows[0].pwd);
    if (!valid)
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(
      `UPDATE ${table} SET ${pwdCol}=$1, updated_at=NOW() WHERE id=$2`,
      [hashed, req.user.id],
    );
    await pool.query(
      `UPDATE refresh_tokens SET is_revoked=true WHERE user_id=$1 AND user_type=$2`,
      [req.user.id, isMember ? "member" : "admin"],
    );

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("[auth:changePassword]", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
