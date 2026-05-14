"use strict";

const ADMIN_ROLES = ["admin", "superadmin"];

const adminMiddleware = (req, res, next) => {
  if (!ADMIN_ROLES.includes(req.user?.role)) {
    return res
      .status(403)
      .json({ success: false, message: "Admin access only" });
  }
  next();
};

module.exports = adminMiddleware;
