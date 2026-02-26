const express = require("express");
const router = express.Router();
const {
  postData,
  getData,
  putData,
  delData,
  loginAdmin,
  profileAdmin,
} = require("../controllers.js/authController");
const authMiddleware = require("../middleware/midleware");
router.post("/", postData);
router.get("/", getData);
router.put("/admin/:id", putData);
router.delete("/admin/:id", delData);
// Login Route
router.post("/login", loginAdmin);
router.get("/profile", authMiddleware,profileAdmin);

module.exports = router;
