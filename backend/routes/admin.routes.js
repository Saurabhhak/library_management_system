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
router.post("/", createAdmin);

// ---- Get all admins
router.get("/", getAllAdmins);

// ---- Get admin by id
router.get("/:id", getAdminById);

// ---- Update admin
router.put("/:id", updateAdmin);

// ---- Delete admin
router.delete("/:id", deleteAdmin);

module.exports = router;
