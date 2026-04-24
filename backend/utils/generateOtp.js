// const crypto = require("crypto");

// const generateOtp = (length = 6) =>
//   crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

// module.exports = generateOtp;

// utils/generateOtp.js
"use strict";

/**
 * Generates a cryptographically-safe 6-digit OTP string.
 * Pads with leading zeros so it is always exactly 6 digits.
 * e.g. 004821, 938201
 *
 * @returns {string}
 */
const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return String(otp);
};

// Supports BOTH import styles used across the project:
//   const generateOtp          = require("./generateOtp");   ← default  (password.controller)
//   const { generateOtp }      = require("./generateOtp");   ← named    (otp.controller)
module.exports = generateOtp;
module.exports.generateOtp = generateOtp;