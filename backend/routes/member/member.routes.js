"use strict";

const router = require("express").Router();
const auth = require("../../middleware/auth.middleware");
const role = require("../../middleware/role.middleware");

const {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
} = require("../../controllers/member/member.controller");

const authCtrl = require("../../controllers/auth/auth.controller");

/* ── Public — member self-registration (no auth required) ── */
router.post("/", createMember);

/* ── Own profile / security — before "/:id" (same ordering reason) ── */
router.put("/profile", auth, role("member"), authCtrl.updateProfile);
router.put("/change-password", auth, role("member"), authCtrl.changePassword);

/* ── Admin-only — full member CRUD ── */
router.get("/", auth, role("admin", "superadmin"), getMembers);
router.get("/:id", auth, role("admin", "superadmin"), getMemberById);
router.put("/:id", auth, role("admin", "superadmin"), updateMember);
router.delete("/:id", auth, role("admin", "superadmin"), deleteMember);

module.exports = router;
