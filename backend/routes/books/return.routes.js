const express = require("express");
const router = express.Router();
const { returnBook } = require("../../controllers/books/returnBook.controller");
const authMiddleware = require("../../middleware/auth.middleware");

router.post("/", authMiddleware, returnBook);

module.exports = router;
