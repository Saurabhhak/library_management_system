"use strict";
const router = require("express").Router();
const auth = require("../../middleware/auth.middleware");
const adminMw = require("../../middleware/admin.middleware");
const role = require("../../middleware/role.middleware");

const {
  createBook,
  getBooks,
  updateBook,
  deleteBook,
} = require("../../controllers/books/book.controller");

/* Any authenticated user can browse books */
router.get("/", auth, getBooks);

/* Only admin/superadmin can create, update, delete */
router.post("/", auth, adminMw, createBook);
router.put("/:id", auth, adminMw, updateBook);
router.delete("/:id", auth, adminMw, deleteBook);

module.exports = router;
