"use strict";

const router = require("express").Router();

// Middlewares
const auth = require("../../middleware/auth.middleware");
const role = require("../../middleware/role.middleware");

// Controllers
const { getDashboardStats } = require("../../controllers/admin/dashboard.controller");

/* ════════════════════════════════════════════════════════════════
   DASHBOARD ROUTES
════════════════════════════════════════════════════════════════ */

// Fetch analytical stats for the admin dashboard
router.get("/stats", auth, role("admin", "superadmin"), getDashboardStats);

module.exports = router;

/* 
  NOTE FOR MAIN ROUTER (routes/index.js):
  Don't forget to mount this file in your main index file like this:
  
  router.use("/admin/dashboard", require("./admin/dashboard.routes"));
*/