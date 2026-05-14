"use strict";

const memberMiddleware = (req, res, next) => {
  if (req.user?.role !== "member") {
    return res
      .status(403)
      .json({ success: false, message: "Member access only" });
  }
  next();
};

module.exports = memberMiddleware;
