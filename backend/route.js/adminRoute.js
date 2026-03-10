const express = require("express");
const router = express.Router();

const {
  postData,
  getData,
  getAdminById,
  putData,
  delData,
  deleteOwnAccount,
  loginAdmin,
  profileAdmin,
} = require("../controllers.js/auth.controller");

const {
  getStates,
  getCitiesByState,
} = require("../controllers.js/meta.controller");

const authMiddleware = require("../middleware/midleware");

// -------- AUTH --------

router.post("/login", loginAdmin);

router.get("/profile", authMiddleware, profileAdmin);

// -------- DELETE OWN ACCOUNT --------

router.delete("/delete-account", authMiddleware, deleteOwnAccount);

// -------- META --------

router.get("/meta/states", getStates);
router.get("/meta/cities/:stateId", getCitiesByState);

// -------- ADMIN CRUD --------

router.post("/", postData);

router.get("/", getData);

router.get("/:id", getAdminById);

router.put("/:id", putData);

router.delete("/:id", delData);

module.exports = router;
