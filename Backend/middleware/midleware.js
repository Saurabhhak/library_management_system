const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Read token from Authorization header
  const bearerHeader = req.headers.authorization;

  if (!bearerHeader) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }
  // Remove Bearer prefix
  const token = bearerHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = verifyToken;
