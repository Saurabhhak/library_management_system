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

// SUPER ADMIN ROLE BASED ACCESS CONTROL
// const superAdminMiddleware = require("../middleware/superAdmin.middleware");

// Profile OR Delete Own Account
const middleware = require("../../middleware/auth.middleware");
router.get("/profile", middleware, profileAdmin);
router.delete("/delete-account", middleware, deleteOwnAccount);

// Create admin
router.post("/", middleware, createAdmin);

// Get all admins
router.get("/", middleware, getAllAdmins);

// Get admin by id
router.get("/:id", middleware, getAdminById);

// Update admin
router.put("/:id", middleware, updateAdmin);

// Delete admin
router.delete("/:id", middleware, deleteAdmin);

module.exports = router;
