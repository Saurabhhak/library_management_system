"use strict";
const router = require("express").Router();
const {
  memberLogin,
  checkMemberEmail,
} = require("../../controllers/member/member.auth.controller");

router.post("/login", memberLogin);
router.post("/check-email", checkMemberEmail);

module.exports = router;
