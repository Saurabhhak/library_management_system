"use strict";
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const ACCESS_SECRET = process.env.JWT_SECRET;
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "15m";
const REFRESH_TTL_DAYS = 7;
const REFRESH_TTL_MS = REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000;

if (!ACCESS_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

/* ── Access token: sign + verify ─────────────────────────────── */
const signAccessToken = (payload) =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });

const verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);

/* ── Refresh token: opaque random string, hashed before DB save ── */
const generateRefreshToken = () => crypto.randomBytes(64).toString("hex");

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const refreshExpiresAt = () => new Date(Date.now() + REFRESH_TTL_MS);

module.exports = {
  signAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  hashToken,
  refreshExpiresAt,
  REFRESH_TTL_DAYS,
};