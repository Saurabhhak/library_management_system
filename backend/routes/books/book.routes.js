const express = require("express");
const router = express.Router();

const {
  createBook,
  getBooks,
  updateBook,
  deleteBook,
} = require("../../controllers/books/book.controller");

// const authMiddleware = require("../../middleware/auth.middleware");

// Protected Routes
router.post("/", createBook);
router.get("/", getBooks);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;
