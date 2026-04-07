const express = require("express");
const router = express.Router();

const {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
} = require("../../controllers/member/member.controller");

// const authMiddleware = require("../middleware/auth.middleware");

// Create
router.post("/", createMember);

// Get all
router.get("/", getMembers);

// Get by ID
router.get("/:id", getMemberById);

// Update
router.put("/:id", updateMember);

// Delete
router.delete("/:id", deleteMember);

module.exports = router;