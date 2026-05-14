"use strict";
const router  = require("express").Router();
const auth    = require("../../middleware/auth.middleware");
const adminMw = require("../../middleware/admin.middleware");
const { returnBook } = require("../../controllers/books/returnBook.controller");
 
/* Admin/superadmin only */
router.post("/", auth, adminMw, returnBook);
 
module.exports = router;
 
 