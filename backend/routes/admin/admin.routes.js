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
} = require("../../controllers/admin/admin.controller");
const authCtrl = require("../../controllers/auth/auth.controller");

/* ════════════════════════════════════════════════════════════════
   SELF-SERVICE ROUTES
   NOTE: Must be registered before "/:id" routes to avoid Express 
   treating "/profile" as a dynamic ID parameter.
════════════════════════════════════════════════════════════════ */

// Update own profile details (Accessible to all staff)
router.put(
  "/profile",
  auth,
  role("admin", "superadmin", "librarian", "staff"),
  authCtrl.updateProfile,
);

// Change own password (Accessible to all staff)
router.put(
  "/change-password",
  auth,
  role("admin", "superadmin", "librarian", "staff"),
  authCtrl.changePassword,
);

/* ════════════════════════════════════════════════════════════════
   ADMIN MANAGEMENT (CRUD)
════════════════════════════════════════════════════════════════ */

// Create a new admin (Superadmin only)
router.post("/", auth, role("superadmin"), createAdmin);

// Fetch all admins (Admin & Superadmin)
router.get("/", auth, role("admin", "superadmin"), getAllAdmins);

// Fetch a specific admin by ID (Superadmin only)
router.get("/:id", auth, role("superadmin"), getAdminById);

// Update a specific admin by ID (Superadmin only)
router.put("/:id", auth, role("superadmin"), updateAdmin);

// Delete an admin (Superadmin only)
router.delete("/:id", auth, role("superadmin"), deleteAdmin);

module.exports = router;
