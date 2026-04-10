// // Setup Express server and middleware
// const jwt = require("jsonwebtoken");
// const authMiddleware = (req, res, next) => {
//   // Header me value aayegi
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token)
//     return res.status(401).json({
//       success: false,
//       message: "Token missing",
//     });
//   // Token extract hota hai
//   // const header = token.split(" ")[1];
//   // Middleware verifies token || JWT verify
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // req.user me store
//     //     Now backend knows:
//     //     req.user.id = 7
//     next();
//   } catch (error) {
//     return res.status(403).json({
//       success: false,
//       message: "Invalid token",
//     });
//   }
// };

// module.exports = authMiddleware;


const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  //  TEMP: disable auth
  if (process.env.DISABLE_AUTH === "true") {
    console.warn("Auth Disabled (DEV MODE)");

    // fake user inject (important for req.user usage)
    req.user = {
      id: 1,
      role: "superadmin",
    };

    return next();
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;