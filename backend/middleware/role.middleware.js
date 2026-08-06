"use strict";

module.exports = function role(...allowed) {
  return (req, res, next) => {
    if (!req.user)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });

    if (!allowed.includes(req.user.role))
      return res.status(403).json({
        success: false,
        message: `Access denied. Allowed: ${allowed.join(", ")}`,
      });

    return next();
  };
};
