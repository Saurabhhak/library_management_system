const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // bypass authentication
  req.user = { id: 1, role: "superadmin" }; // fake user
  next();
};
// const authMiddleware = (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Access denied. Token missing",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = decoded; // { id, role }

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };

module.exports = authMiddleware;
