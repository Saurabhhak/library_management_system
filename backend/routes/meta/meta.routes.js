"use strict";
const router = require("express").Router();
const {
  getStates, getCitiesByState,
} = require("../../controllers/meta/meta.controller");
 
router.get("/states",           getStates);          // Public
router.get("/cities/:stateId",  getCitiesByState);   // Public
 
module.exports = router;