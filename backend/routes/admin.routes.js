const express = require("express");
const router = express.Router();

const {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/admin.controller");
const {
  profileAdmin,
  deleteOwnAccount,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");
const superAdminMiddleware = require("../middleware/superAdmin.middleware");

// Profile OR Delete Own Account
router.get("/profile", authMiddleware, profileAdmin);
router.delete("/delete-account", authMiddleware, deleteOwnAccount);

// Create admin
router.post("/", authMiddleware, superAdminMiddleware, createAdmin);

// Get all admins
router.get("/", authMiddleware, superAdminMiddleware, getAllAdmins);

// Get admin by id
router.get("/:id", authMiddleware, superAdminMiddleware, getAdminById);

// Update admin
router.put("/:id", authMiddleware, superAdminMiddleware, updateAdmin);

// Delete admin
router.delete("/:id", authMiddleware, superAdminMiddleware, deleteAdmin);

module.exports = router;
