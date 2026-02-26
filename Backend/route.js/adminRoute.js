const express = require("express");
const router = express.Router();
const {
  postData,
  getData,
  putData,
  delData,
  loginAdmin,
} = require("../controllers.js/authController");
router.post("/", postData);
router.get("/", getData);
router.put("/admin/:id", putData);
router.delete("/admin/:id", delData);
// Login Route
router.post("/login", loginAdmin);

module.exports = router;
