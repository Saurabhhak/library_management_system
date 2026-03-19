const router = require("express").Router();

// MAIN ROUTES
router.use("/auth", require("./auth.routes"));
router.use("/admin", require("./admin.routes"));

// Other modules
router.use("/books", require("./book.routes"));
router.use("/categories", require("./category.routes"));
router.use("/password", require("./password.routes"));
router.use("/meta", require("./meta.routes"));

module.exports = router;