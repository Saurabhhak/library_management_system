// const db = require("../../config/db");
// //   --------- Save OTP --------------
// const saveOtp = async (email, otp) => {
//   const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

//   await db.query(
//     "INSERT INTO otp_verifications (email, otp, expires_at) VALUES ($1,$2,$3)",
//     [email, otp, expiresAt],
//   );
// };
// //   --------- Verify OTP --------------
// const verifyOtp = async (email, otp) => {
//   const result = await db.query(
//     `SELECT * FROM otp_verifications 
//      WHERE email=$1 AND otp=$2 
//      ORDER BY id DESC LIMIT 1`,
//     [email, otp],
//   );

//   if (!result.rows.length) return false;

//   const record = result.rows[0];

//   if (new Date() > record.expires_at) return false;

//   await db.query("UPDATE otp_verifications SET is_verified=true WHERE id=$1", [
//     record.id,
//   ]);

//   return true;
// };

// module.exports = { saveOtp, verifyOtp };

// _________________________________________________________________________________

// services/mail/otp.service.js
// In-memory OTP store with automatic expiry.
// Used by otp.controller (registration / generic OTP flow).
// For the forgot-password flow, OTPs are persisted in the admin table
// directly by password.controller — this service is NOT used there.
"use strict";

// Map<email, { otp: string, expiresAt: number }>
const otpStore = new Map();

const OTP_TTL_MS = 2 * 60 * 1000; // 2 minutes

/**
 * Saves (or overwrites) an OTP for the given email.
 * Replaces any previous OTP immediately.
 *
 * @param {string} email
 * @param {string|number} otp
 */
const saveOtp = async (email, otp) => {
  if (!email || !otp) throw new Error("[OtpService] email and otp are required.");

  otpStore.set(email.trim().toLowerCase(), {
    otp:       String(otp),
    expiresAt: Date.now() + OTP_TTL_MS,
  });

  console.log(`[OtpService] OTP saved for ${email} (expires in 2 min)`);
};

/**
 * Verifies an OTP for the given email.
 * Deletes the entry on a successful match (one-time use).
 *
 * @param {string} email
 * @param {string|number} otp
 * @returns {boolean}
 */
const verifyOtp = async (email, otp) => {
  if (!email || !otp) return false;

  const key    = email.trim().toLowerCase();
  const record = otpStore.get(key);

  if (!record) {
    console.warn(`[OtpService] No OTP found for ${email}`);
    return false;
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    console.warn(`[OtpService] OTP expired for ${email}`);
    return false;
  }

  if (record.otp !== String(otp)) {
    console.warn(`[OtpService] OTP mismatch for ${email}`);
    return false;
  }

  // Consume the OTP — cannot be reused
  otpStore.delete(key);
  console.log(`[OtpService] OTP verified for ${email}`);
  return true;
};

/**
 * Manually clears an OTP entry (e.g. after registration completes).
 * Safe to call even if no entry exists.
 *
 * @param {string} email
 */
const clearOtp = (email) => {
  if (email) otpStore.delete(email.trim().toLowerCase());
};

module.exports = { saveOtp, verifyOtp, clearOtp };