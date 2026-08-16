"use strict";

const router = require("express").Router();
const auth = require("../../middleware/auth.middleware");
const role = require("../../middleware/role.middleware");

// Import newly named controllers
const {
  enrollInstitutionalMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
} = require("../../controllers/member/member.controller");

const authCtrl = require("../../controllers/auth/auth.controller");

// ── GLOBAL AUTH MIDDLEWARE ──
// Ensuring every route below is protected
router.use(auth);

/* ════════════════════════════════════════════════════════════════
   PERSONAL PROFILE ROUTES (For Members)
════════════════════════════════════════════════════════════════ */
router.put("/profile", role("member"), authCtrl.updateProfile);
router.put("/change-password", role("member"), authCtrl.changePassword);

/* ════════════════════════════════════════════════════════════════
   ADMIN / LIBRARIAN ROUTES
════════════════════════════════════════════════════════════════ */
const staffRoles = role("admin", "superadmin", "librarian");

// Enroll new member
router.post("/", staffRoles, enrollInstitutionalMember);

// Fetch all members
router.get("/", staffRoles, getMembers);

// Fetch single member by ID
router.get("/:id", staffRoles, getMemberById);

// Update member
router.put("/:id", staffRoles, updateMember);

// Soft delete member
router.delete("/:id", staffRoles, deleteMember);

module.exports = router;
