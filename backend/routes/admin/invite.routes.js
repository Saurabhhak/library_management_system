const express = require("express");
const router = express.Router();

const { sendInvite } = require("../../controllers/admin/invite.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const superAdminMiddleware = require("../../middleware/superAdmin.middleware");

/* SEND INVITE */
router.post("/", authMiddleware, superAdminMiddleware, sendInvite);
module.exports = router;