// Setup Express server and middleware
const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  // Header me value aayegi
  const header = req.headers.authorization;
  if (!header)
    return res.status(401).json({
      success: false,
      message: "Token missing",
    });
  // Token extract hota hai
  const token = header.split(" ")[1];
  // Middleware verifies token || JWT verify
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // req.user me store
    //     Now backend knows:
    //     req.user.id = 7
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;
