// routes/issueBook.routes.js

const express = require("express");
const router = express.Router();

const { issueBook } = require("../../controllers/books/issueBook.controller");
const authMiddleware = require("../../middleware/auth.middleware");

// POST /api/issue
router.post("/", authMiddleware, issueBook);

module.exports = router;
