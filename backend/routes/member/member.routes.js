"use strict";
const router = require("express").Router();
const auth = require("../../middleware/auth.middleware");
const adminMw = require("../../middleware/admin.middleware");
const memberMw = require("../../middleware/member.middleware");

const {
  createMember,
  getMembers,
  // getMemberById,
  updateMember,
  deleteMember,
} = require("../../controllers/member/member.controller");

// const {
//   getMemberProfile,
//   updateMemberProfile,
//   changeMemberPassword,
// } = require("../../controllers/member/member.profile.controller");

/* ── Public — member self-registration (no auth required) ── */
router.post("/", createMember);

/* ── Admin-only — full member CRUD ── */
router.get("/", auth, adminMw, getMembers);
// router.get("/:id", auth, adminMw, getMemberById);
router.put("/:id", auth, adminMw, updateMember);
router.delete("/:id", auth, adminMw, deleteMember);

/* ── Member self-service (member can only manage own data) ── */
// router.get("/profile", auth, memberMw, getMemberProfile);
// router.put("/profile", auth, memberMw, updateMemberProfile);
// router.put("/change-password", auth, memberMw, changeMemberPassword);

module.exports = router;
