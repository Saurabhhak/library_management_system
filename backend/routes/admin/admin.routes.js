const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth.middleware");

/* ── Bug Fix #4: completeProfile imported here so route is
      PUT /api/admin/complete-profile  — matches profile.service.js ── */
const { completeProfile } = require("../../controllers/admin/auth.controller");

const {
  getProfile,
  updateProfile,
  deleteAccount,
} = require("../../controllers/admin/auth.controller");

// ─── PROFILE ──────────────────────────────────────────────────────
router.get("/profile", authMiddleware, getProfile);
router.put("/update-profile", authMiddleware, updateProfile);
router.delete("/delete-account", authMiddleware, deleteAccount);

// ─── COMPLETE PROFILE (after Google invite login) ─────────────────
// Matches: PUT /api/admin/complete-profile  ← called by profile.service.js
router.put("/complete-profile", authMiddleware, completeProfile);

module.exports = router;
