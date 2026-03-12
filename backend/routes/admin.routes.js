// routes/admin.routes.js
const express = require("express");
const router = express.Router();

// -------- Controllers --------
const {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/admin.controller");

const {
  loginAdmin,
  profileAdmin,
  deleteOwnAccount,
} = require("../controllers/auth.controller");

const {
  getStates,
  getCitiesByState,
} = require("../controllers/meta.controller");

// -------- Middleware --------
const authMiddleware = require("../middleware/auth.middleware");
const superAdminMiddleware = require("../middleware/superAdmin.middleware");
//  ------------ AUTH ROUTES

// -------------- Login admin
router.post("/login", loginAdmin);

// ---- Get logged-in admin profile
router.get("/profile", authMiddleware, profileAdmin);

// ---- Delete own account
router.delete("/delete-account", authMiddleware, deleteOwnAccount);

// ----  META DATA ROUTES (States / Cities)
router.get("/meta/states", getStates);
router.get("/meta/cities/:stateId", getCitiesByState);

// --------------------- ADMIN CRUD ROUTES

// ---- Create new admin
router.post("/", authMiddleware, superAdminMiddleware, createAdmin);

// ---- Get all admins
router.get("/", authMiddleware, superAdminMiddleware, getAllAdmins);

// ---- Get admin by id
router.get("/:id", authMiddleware, superAdminMiddleware, getAdminById);

// ---- Update admin
router.put("/:id", authMiddleware, superAdminMiddleware, updateAdmin);

// ---- Delete admin
router.delete("/:id", authMiddleware, superAdminMiddleware, deleteAdmin);

module.exports = router;
