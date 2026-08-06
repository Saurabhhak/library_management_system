"use strict";

const pool = require("../../config/db");
const generateOtp = require("../../utils/generateOtp");
const { sendOtpEmail } = require("../../services/mail/email.service");

const OTP_EXPIRY_MINUTES = 10;

/* ════════════════════════════════════════════════════════════════
   POST /api/auth/send-otp   (public)
   Body: { email, role: "admin"|"member", purpose: "registration"|"password_reset" }
════════════════════════════════════════════════════════════════ */
exports.sendOtp = async (req, res) => {
  const { email, role, purpose = "registration" } = req.body;

  if (!email || !role)
    return res
      .status(400)
      .json({ success: false, message: "email and role required" });
  if (!["admin", "member"].includes(role))
    return res.status(400).json({ success: false, message: "Invalid role" });
  if (!["registration", "password_reset"].includes(purpose))
    return res.status(400).json({ success: false, message: "Invalid purpose" });

  try {
    const lEmail = email.toLowerCase();

    const [adminMatch, memberMatch] = await Promise.all([
      pool.query(
        "SELECT id FROM admin WHERE LOWER(email)=$1 AND is_deleted=false",
        [lEmail],
      ),
      pool.query(
        "SELECT id FROM members WHERE LOWER(email)=$1 AND is_deleted=false",
        [lEmail],
      ),
    ]);
    const emailExists =
      adminMatch.rows.length > 0 || memberMatch.rows.length > 0;

    if (purpose === "registration" && emailExists)
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });

    if (purpose === "password_reset" && !emailExists)
      return res.json({
        success: true,
        message: "If that email exists, an OTP has been sent",
      });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60_000);

    await pool.query(
      "DELETE FROM otp_verifications WHERE LOWER(email) = $1 AND purpose = $2 AND role = $3",
      [lEmail, purpose, role],
    );
    await pool.query(
      `INSERT INTO otp_verifications (email, otp, purpose, role, expires_at) VALUES ($1, $2, $3, $4, $5)`,
      [lEmail, otp, purpose, role, expiresAt],
    );
    await sendOtpEmail({ to: email, otp, expiresMinutes: OTP_EXPIRY_MINUTES });

    return res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("[otp:sendOtp]", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP" });
  }
};

/* ════════════════════════════════════════════════════════════════
   POST /api/auth/verify-otp   (public)
   Body: { email, otp, role, purpose: "registration"|"password_reset" }
════════════════════════════════════════════════════════════════ */
exports.verifyOtp = async (req, res) => {
  const { email, otp, role, purpose = "registration" } = req.body;

  if (!email || !otp || !role)
    return res
      .status(400)
      .json({ success: false, message: "email, otp and role required" });

  try {
    const { rows } = await pool.query(
      `SELECT id FROM otp_verifications
       WHERE LOWER(email) = $1
         AND otp          = $2
         AND purpose      = $3
         AND role         = $4
         AND is_verified  = false
         AND expires_at   > NOW()`,
      [email.toLowerCase(), String(otp), purpose, role],
    );

    if (!rows.length)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });

    await pool.query(
      "UPDATE otp_verifications SET is_verified = true WHERE id = $1",
      [rows[0].id],
    );

    return res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error("[otp:verifyOtp]", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Verification failed" });
  }
};
