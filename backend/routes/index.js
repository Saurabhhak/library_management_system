"use strict";

const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/admin", require("./admin/admin.routes"));
router.use("/admin/dashboard", require("./admin/dashboard.routes"));
router.use("/members", require("./member/member.routes"));
router.use("/feedback", require("./resources/feedback.routes"));
router.use("/contact", require("./contact/contact.routes"));
router.use("/books", require("./books/book.routes"));
router.use("/categories", require("./books/category.routes"));
router.use("/transactions", require("./transactions/transaction.routes"));
router.use("/meta", require("./meta/meta.routes"));

module.exports = router;
