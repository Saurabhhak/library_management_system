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

// Fetch user details (Admin or Member) by email
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

// Hash and store the opaque refresh token in the database
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
   Authenticates user, generates tokens, and saves session.
════════════════════════════════════════════════════════════════ */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });

  try {
    const user = await findUserByEmail(email.toLowerCase());

    // Validate user existence and password match
    if (!user || !(await bcrypt.compare(password, user.pwd)))
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    // Ensure account is active
    if (user.active_flag !== "active")
      return res.status(403).json({
        success: false,
        message: "Account inactive. Contact support.",
      });

    // Update admin activity status
    if (user.userType === "admin")
      await pool.query(
        "UPDATE admin SET last_seen = NOW(), is_online = true WHERE id = $1",
        [user.id],
      );

    // Generate tokens
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      userType: user.userType, // Used by AuthContext for decoding
    };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken();

    await saveRefreshToken(user.id, user.userType, refreshToken, req);

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
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
   Validates refresh token, checks for theft, and issues new tokens.
════════════════════════════════════════════════════════════════ */
exports.refresh = async (req, res) => {
  const rawToken = req.body?.refreshToken;

  if (!rawToken)
    return res
      .status(401)
      .json({ success: false, message: "No refresh token provided" });

  try {
    // Fetch token regardless of revocation status to detect theft
    const { rows } = await pool.query(
      `SELECT * FROM refresh_tokens WHERE token_hash = $1`,
      [hashToken(rawToken)],
    );

    if (!rows.length)
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });

    const rt = rows[0];

    /* ── Reuse / Theft Detection ── 
       If a revoked token is used again, it might be stolen. 
       Invalidate all active sessions for this user to ensure security. */
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

    // Check expiration time
    if (new Date(rt.expires_at) <= new Date())
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });

    // Fetch user details based on user type
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

    // Token Rotation: Revoke old token, issue a new one
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
   POST /api/auth/logout
   Revokes the active refresh token and updates online status.
════════════════════════════════════════════════════════════════ */
exports.logout = async (req, res) => {
  const rawToken = req.body?.refreshToken;

  try {
    // Revoke the token in the database
    if (rawToken)
      await pool.query(
        "UPDATE refresh_tokens SET is_revoked = true WHERE token_hash = $1",
        [hashToken(rawToken)],
      );

    // Update admin's online status
    if (req.user?.role !== "member")
      await pool.query(
        "UPDATE admin SET last_seen = NOW(), is_online = false WHERE id = $1",
        [req.user.id],
      );

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("[auth:logout]", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ════════════════════════════════════════════════════════════════
   GET /api/auth/profile
   Fetches full user profile details based on role.
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
   POST /api/auth/check-email
   Public endpoint to verify if an email is already registered.
════════════════════════════════════════════════════════════════ */
exports.checkEmail = async (req, res) => {
  const { email, role } = req.body;

  if (!email || !["admin", "member"].includes(role))
    return res
      .status(400)
      .json({ success: false, message: "Email and valid role are required" });

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
   POST /api/auth/heartbeat
   Updates the "last active" timestamp for admins.
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
   PUT /api/auth/profile
   Updates basic user profile information.
════════════════════════════════════════════════════════════════ */
exports.updateProfile = async (req, res) => {
  const { first_name, last_name, phone } = req.body;

  if (!first_name || !last_name)
    return res.status(400).json({
      success: false,
      message: "First name and last name are required",
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
        message: "Profile updated successfully",
        user: rows[0],
      });
    }

    // Handle Admin profile update
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
      message: "Profile updated successfully",
      user: rows[0],
    });
  } catch (err) {
    console.error("[auth:updateProfile]", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ════════════════════════════════════════════════════════════════
   POST /api/auth/change-password
   Verifies current password and updates to a new one.
════════════════════════════════════════════════════════════════ */
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    return res.status(400).json({
      success: false,
      message: "Current password and new password are required",
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

    // Fetch current hashed password
    const { rows } = await pool.query(
      `SELECT ${pwdCol} AS pwd FROM ${table} WHERE id=$1 AND is_deleted=false`,
      [req.user.id],
    );

    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // Verify current password
    const valid = await bcrypt.compare(currentPassword, rows[0].pwd);
    if (!valid)
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });

    // Hash new password and update database
    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE ${table} SET ${pwdCol}=$1, updated_at=NOW() WHERE id=$2`,
      [hashed, req.user.id],
    );

    // Revoke all existing sessions for security
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
