"use strict";

const router = require("express").Router();
const auth = require("../../middleware/auth.middleware");
const role = require("../../middleware/role.middleware");
const { getDashboardStats } = require("../../controllers/admin/dashboard.controller");

router.get("/stats", auth, role("admin", "superadmin"), getDashboardStats);

module.exports = router;

/*
  Add this line to routes/index.js:
    router.use("/admin/dashboard", require("./admin/dashboard.routes"));
*/
