"use strict";

const router = require("express").Router();
const auth = require("../../middleware/auth.middleware");
const role = require("../../middleware/role.middleware");

const {
  publicRegister,
  createMemberByAdmin,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
} = require("../../controllers/member/member.controller");

const authCtrl = require("../../controllers/auth/auth.controller");

/* ── Public — Guest self-registration (OTP gated) ── */
router.post("/register", publicRegister);

/* ── Own profile updates ── */
router.put("/profile", auth, role("member"), authCtrl.updateProfile);
router.put("/change-password", auth, role("member"), authCtrl.changePassword);

/* ── Admin-only — Full University CRUD ── */
router.post("/", auth, role("admin", "superadmin"), createMemberByAdmin);
router.get("/", auth, role("admin", "superadmin"), getMembers);
router.get("/:id", auth, role("admin", "superadmin"), getMemberById);
router.put("/:id", auth, role("admin", "superadmin"), updateMember);
router.delete("/:id", auth, role("admin", "superadmin"), deleteMember);

module.exports = router;
