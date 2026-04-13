const router = require("express").Router();
const auth = require("../../middleware/auth.middleware");
const superAdmin = require("../../middleware/superAdmin.middleware");
const {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} = require("../../controllers/admin/admin.controller");
const {
  profileAdmin,
  deleteOwnAccount,
} = require("../../controllers/admin/auth.controller");

// Own-account routes (any authenticated admin)
router.get("/profile", auth, profileAdmin);
router.delete("/delete-account", auth, deleteOwnAccount);

// SuperAdmin-only CRUD
router.post("/", auth, superAdmin, createAdmin);
router.get("/", auth, superAdmin, getAllAdmins);
router.get("/:id", auth, superAdmin, getAdminById);
router.put("/:id", auth, superAdmin, updateAdmin);
router.delete("/:id", auth, superAdmin, deleteAdmin);

module.exports = router;
