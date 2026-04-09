const express = require("express");
const router = express.Router();

const {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} = require("../../controllers/admin/admin.controller");
const {
  profileAdmin,
  deleteOwnAccount,
} = require("../../controllers/admin/auth.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const superAdminMiddleware = require("../../middleware/superAdmin.middleware");

// _______ Profile OR Delete Own Account ________
router.get("/profile", authMiddleware, profileAdmin);
router.delete("/delete-account", authMiddleware, deleteOwnAccount);

// _______ Create admin ________
router.post("/", authMiddleware, superAdminMiddleware, createAdmin);

// _______ Get all admins ________
router.get("/", authMiddleware, superAdminMiddleware, getAllAdmins);

// _______ Get admin by id ________
router.get("/:id", authMiddleware, superAdminMiddleware, getAdminById);

// _______ Update admin ________
router.put("/:id", authMiddleware, superAdminMiddleware, updateAdmin);

// _______ Delete admin ________
router.delete("/:id", authMiddleware, superAdminMiddleware, deleteAdmin);

module.exports = router;
