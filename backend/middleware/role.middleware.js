"use strict";
 
const roleMiddleware = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user?.role)) {
    return res.status(403).json({
      success: false,
      message: `Access restricted to: ${allowedRoles.join(", ")}`,
    });
  }
  next();
};
 
module.exports = roleMiddleware;