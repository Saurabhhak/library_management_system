"use strict";
const router = require("express").Router();
const auth = require("../../middleware/auth.middleware");
const adminMw = require("../../middleware/admin.middleware");

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../../controllers/books/category.controller");

/* Any authenticated user can read categories */
router.get("/", auth, getCategories);

/* Only admin/superadmin can manage categories */
router.post("/", auth, adminMw, createCategory);
router.put("/:id", auth, adminMw, updateCategory);
router.delete("/:id", auth, adminMw, deleteCategory);

module.exports = router;
