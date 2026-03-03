// implement authentication and book routes
// Defined API endpoints for user authentication and book management.
// Structured routes to maintain separation of concerns and improve maintainability.

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

const {
  getStates,
  getCitiesByState,
} = require("../controllers.js/metaController");

const authMiddleware = require("../middleware/midleware");

// CRUD
router.post("/", postData);
router.get("/", getData);
router.put("/:id", putData);
router.delete("/:id", delData);

// Auth
router.post("/login", loginAdmin);
router.get("/profile", authMiddleware, profileAdmin);

// Meta
router.get("/meta/states", getStates);
router.get("/meta/cities/:stateId", getCitiesByState);

module.exports = router;
