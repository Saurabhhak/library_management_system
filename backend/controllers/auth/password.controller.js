"use strict";

const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const generateOtp = require("../../utils/generateOtp");
const { sendOtpEmail } = require("../../services/mail/email.service");

const OTP_EXPIRY_MINUTES = 10;

/* ── Table + password column map ──────────────────────────────── */
const TABLES = [
  { userType: "admin", table: "admin", pwdCol: "password_hash" },
  { userType: "member", table: "members", pwdCol: "password" },
];

/** Find which table (admin or members) has this email. */
const findAccount = async (lEmail) => {
  const [adminRes, memberRes] = await Promise.all(
    TABLES.map((t) =>
      pool.query(
        `SELECT id FROM ${t.table} WHERE LOWER(email) = $1 AND is_deleted = false`,
        [lEmail],
      ),
    ),
  );
  if (adminRes.rows.length) return { ...TABLES[0], id: adminRes.rows[0].id };
  if (memberRes.rows.length) return { ...TABLES[1], id: memberRes.rows[0].id };
  return null;
};

/* ════════════════════════════════════════════════════════════════
   POST /api/auth/forgot-password   (public)
   Body: { email }   ← NO role. Backend searches both tables.
   Never reveals whether account exists (security).
════════════════════════════════════════════════════════════════ */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ success: false, message: "email required" });

  try {
    const lEmail = email.toLowerCase();
    const account = await findAccount(lEmail);

    // Always return success — don't leak which emails are registered
    if (!account)
      return res.json({
        success: true,
        message: "If that email exists, an OTP has been sent",
      });

    const otp = generateOtp();
    const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60_000);

    await pool.query(
      `UPDATE ${account.table} SET reset_otp = $1, reset_otp_expiry = $2 WHERE LOWER(email) = $3`,
      [otp, expiry, lEmail],
    );

    await sendOtpEmail({ to: email, otp, expiresMinutes: OTP_EXPIRY_MINUTES });

    return res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("[password:forgotPassword]", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ════════════════════════════════════════════════════════════════
   POST /api/auth/reset-password   (public)
   Body: { email, otp, password }   ← NO role. Backend re-detects
   the table by matching email + otp together (both must agree).
════════════════════════════════════════════════════════════════ */
exports.resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  if (!email || !otp || !password)
    return res
      .status(400)
      .json({ success: false, message: "email, otp and password required" });

  try {
    const lEmail = email.toLowerCase();

    for (const t of TABLES) {
      const { rows } = await pool.query(
        `SELECT id FROM ${t.table}
         WHERE LOWER(email)     = $1
           AND reset_otp        = $2
           AND reset_otp_expiry > NOW()
           AND is_deleted       = false`,
        [lEmail, String(otp)],
      );

      if (rows.length) {
        const hash = await bcrypt.hash(password, 10);

        await pool.query(
          `UPDATE ${t.table}
           SET ${t.pwdCol}      = $1,
               reset_otp        = NULL,
               reset_otp_expiry = NULL,
               updated_at       = NOW()
           WHERE LOWER(email) = $2`,
          [hash, lEmail],
        );

        // Revoke all active sessions for this account
        await pool.query(
          "UPDATE refresh_tokens SET is_revoked = true WHERE user_id = $1 AND user_type = $2",
          [rows[0].id, t.userType],
        );

        return res.json({
          success: true,
          message: "Password reset successful",
        });
      }
    }

    // Neither table had a matching email+otp
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired OTP" });
  } catch (err) {
    console.error("[password:resetPassword]", err.message);
    return res.status(500).json({ success: false, message: "Reset failed" });
  }
};
