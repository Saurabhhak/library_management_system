"use strict";
const router = require("express").Router();
const {
  forgotPassword,
  resetPassword,
} = require("../../controllers/validations/password.controller");

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
