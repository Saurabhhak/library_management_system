"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../../controllers/transactions/transaction.controller");
const auth = require("../../middleware/auth.middleware");
const role = require("../../middleware/role.middleware");

// Global Auth Middleware
router.use(auth);

/* ── 1. PERSONAL MEMBER ROUTES (Accessible by members, and staff for testing) ── */
router.get("/my-stats", role("member", "admin", "superadmin", "librarian"), controller.getMyStats);
router.get("/my-history", role("member", "admin", "superadmin", "librarian"), controller.getMyTransactions);

/* ── 2. ADMIN & LIBRARIAN ROUTES ── */
router.get("/stats", role("admin", "superadmin", "librarian"), controller.getStats);
router.get("/monthly-stats", role("admin", "superadmin", "librarian"), controller.getMonthlyStats);
router.get("/", role("admin", "superadmin", "librarian"), controller.getAllTransactions);

router.post("/issue", role("admin", "superadmin", "librarian"), controller.issueBook);
router.post("/return", role("admin", "superadmin", "librarian"), controller.returnBook);

module.exports = router;