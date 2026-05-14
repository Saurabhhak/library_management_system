"use strict";
const router  = require("express").Router();
const auth    = require("../../middleware/auth.middleware");
const adminMw = require("../../middleware/admin.middleware");
const { issueBook } = require("../../controllers/books/issueBook.controller");
 
/* Admin/superadmin only — members cannot issue books themselves */
router.post("/", auth, adminMw, issueBook);
 
module.exports = router;