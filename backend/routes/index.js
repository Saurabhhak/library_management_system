const router = require("express").Router();

/* _____________ AUTH ROUTES (PUBLIC) _____________ */
router.use("/auth", require("./admin/auth.routes"));
router.use("/password", require("./validations/password.routes"));

/* _____________ ADMIN _____________ */
router.use("/admin", require("./admin/admin.routes"));

/* _____________ MEMBERS _____________ */
router.use("/members", require("./member/member.routes"));

/* _____________ BOOKS _____________ */
router.use("/books", require("./books/book.routes"));
router.use("/categories", require("./books/category.routes"));

/* _____________ ISSUE / RETURN _____________ */
router.use("/issue", require("./books/issue.routes"));
router.use("/return", require("./books/return.routes"));

/* _____________ META _____________ */
router.use("/meta", require("./meta/meta.routes"));

module.exports = router;