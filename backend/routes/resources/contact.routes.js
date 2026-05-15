// routes/resources/contact.routes.js
"use strict";

const router = require("express").Router();
const auth = require("../../middleware/auth.middleware");
const adminMw = require("../../middleware/admin.middleware");

const {
  submitContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
} = require("../../controllers/resources/contact.controller");

router.post("/", submitContact); // Public
router.get("/", auth, adminMw, getAllContacts); // Admin
router.patch("/:id/status", auth, adminMw, updateContactStatus); // Admin
router.delete("/:id", auth, adminMw, deleteContact); // Admin

module.exports = router;
