"use strict";
const router = require("express").Router();
const auth = require("../../middleware/auth.middleware");
const adminMw = require("../../middleware/admin.middleware");

const {
  submitFeedback,
  getAllFeedback,
  removeFeedback,
  changeStatus,
} = require("../../controllers/resources/feedback.controller");

router.post("/", submitFeedback); // Public
router.get("/", auth, adminMw, getAllFeedback); // Admin only
router.delete("/:id", auth, adminMw, removeFeedback); // Admin only
router.patch("/:id/status", auth, adminMw, changeStatus); // Admin only

module.exports = router;
