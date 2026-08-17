"use strict";

const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const generateOtp = require("../../utils/generateOtp");
const { sendOtpEmail, sendMail } = require("../../services/mail/email.service");

const OTP_EXPIRY_MINUTES = 10;

const TABLES = [
  { userType: "admin", table: "admin", pwdCol: "password_hash" },
  { userType: "member", table: "members", pwdCol: "password" },
];

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

/* ── 1. FORGOT PASSWORD (Unified for Admin & Members) ── */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ success: false, message: "Email required" });

  try {
    const lEmail = email.toLowerCase();
    const account = await findAccount(lEmail);

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

/* ── 2. RESET PASSWORD ── */
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

    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired OTP" });
  } catch (err) {
    console.error("[password:resetPassword]", err.message);
    return res.status(500).json({ success: false, message: "Reset failed" });
  }
};

/* ── 3. FORGOT INSTITUTIONAL ID (Specifically for Members) ── */
exports.forgotInstitutionalId = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ success: false, message: "Email required" });

  try {
    const lEmail = email.toLowerCase();
    const { rows } = await pool.query(
      `SELECT institutional_id, first_name FROM members WHERE LOWER(email) = $1 AND is_deleted = false`,
      [lEmail],
    );

    if (rows.length === 0) {
      // Security: Do not leak if email exists
      return res.json({
        success: true,
        message: "If that email exists, your Institutional ID has been sent.",
      });
    }

    const { institutional_id, first_name } = rows[0];

    // Send ID via Email
    await sendMail({
      to: email,
      subject: "Your Institutional ID Recovery — APV Library",
      html: `<div style="font-family:Arial,sans-serif;padding:20px;">
              <h2>Hello ${first_name},</h2>
              <p>You requested your Institutional ID for APV Library.</p>
              <p>Your Institutional ID is: <strong style="font-size:18px;color:#2563eb;">${institutional_id}</strong></p>
              <p>Use this ID or your email to access your member dashboard.</p>
             </div>`,
      text: `Hello ${first_name}, Your Institutional ID is: ${institutional_id}`,
    });

    return res.json({
      success: true,
      message: "Institutional ID sent to your email.",
    });
  } catch (err) {
    console.error("[password:forgotInstitutionalId]", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
