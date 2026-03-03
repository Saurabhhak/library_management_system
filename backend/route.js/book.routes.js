const express = require("express");
const router = express.Router();
const {
  createBook,
  getBooks,
  updateBook,
  deleteBook,
} = require("../controllers.js/book.controller");
const authMiddleware = require("../middleware/midleware"); // JWT verify
router.post("/", authMiddleware, createBook);
router.get("/", authMiddleware, getBooks);
router.put("/:id", authMiddleware, updateBook);
router.delete("/:id", authMiddleware, deleteBook);

module.exports = router;
