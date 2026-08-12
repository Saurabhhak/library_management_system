"use strict";

const router = require("express").Router();

// Middlewares
const auth = require("../../middleware/auth.middleware");
const role = require("../../middleware/role.middleware");

// Controllers
const {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getDeletedAdmins,
  restoreAdmin,    
} = require("../../controllers/admin/admin.controller");
const authCtrl = require("../../controllers/auth/auth.controller");

/* ════════════════════════════════════════════════════════════════
   SELF-SERVICE ROUTES
════════════════════════════════════════════════════════════════ */

router.put("/profile", auth, role("admin", "superadmin", "librarian", "staff"), authCtrl.updateProfile);
router.put("/change-password", auth, role("admin", "superadmin", "librarian", "staff"), authCtrl.changePassword);

/* ════════════════════════════════════════════════════════════════
   ADMIN MANAGEMENT (CRUD) & RECYCLE BIN
════════════════════════════════════════════════════════════════ */

// Create a new admin (Superadmin only)
router.post("/", auth, role("superadmin"), createAdmin);

// Get list of deleted admins & members (Superadmin only)
router.get("/deleted", auth, role("superadmin"), getDeletedAdmins);

// Restore a deleted admin/member (Superadmin only)
router.patch("/restore/:id", auth, role("superadmin"), restoreAdmin);

// Fetch all admins (Admin & Superadmin)
router.get("/", auth, role("admin", "superadmin"), getAllAdmins);

// Fetch a specific admin by ID (Superadmin only)
router.get("/:id", auth, role("superadmin"), getAdminById);

// Update a specific admin by ID (Superadmin only)
router.put("/:id", auth, role("superadmin"), updateAdmin);

// Delete an admin (Superadmin only)
router.delete("/:id", auth, role("superadmin"), deleteAdmin);

module.exports = router;