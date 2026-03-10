const express = require("express");
const router = express.Router();
const {
  getStates,
  getCitiesByState,
} = require("../controllers/meta.controller");
// ---- GET ALL STATES
router.get("/states", getStates);
// ---- GET CITIES BY STATE
router.get("/cities/:stateId", getCitiesByState);
module.exports = router;
