const router = require("express").Router();

router.use("/auth", require("./admin/auth.routes"));
router.use("/password", require("./validations/password.routes"));
router.use("/admin", require("./admin/admin.routes"));
router.use("/members", require("./member/member.routes"));
router.use("/books", require("./books/book.routes"));
router.use("/categories", require("./books/category.routes"));
router.use("/issue", require("./books/issue.routes"));
router.use("/return", require("./books/return.routes"));
router.use("/meta", require("./meta/meta.routes"));

module.exports = router;
