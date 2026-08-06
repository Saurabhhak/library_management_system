"use strict";

const router = require("express").Router();
const auth = require("../../middleware/auth.middleware");
const role = require("../../middleware/role.middleware");

const {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} = require("../../controllers/admin/admin.controller");

const authCtrl = require("../../controllers/auth/auth.controller");

/* ───────────────── OWN PROFILE / SECURITY (any staff role) ─────────────────
   IMPORTANT: registered BEFORE "/:id" routes — warna Express "/profile"
   ko :id="profile" samajh kar updateAdmin pe bhej deta (maine ye real
   Express server pe test karke confirm kiya hai). */
router.put(
  "/profile",
  auth,
  role("admin", "superadmin", "librarian", "staff"),
  authCtrl.updateProfile,
);
router.put(
  "/change-password",
  auth,
  role("admin", "superadmin", "librarian", "staff"),
  authCtrl.changePassword,
);

/* ───────────────── SUPER ADMIN CRUD ───────────────── */
router.post("/", auth, role("superadmin"), createAdmin);
router.get("/", auth, role("admin", "superadmin"), getAllAdmins);
router.get("/:id", auth, role("superadmin"), getAdminById);
router.put("/:id", auth, role("superadmin"), updateAdmin);
router.delete("/:id", auth, role("superadmin"), deleteAdmin);

module.exports = router;
