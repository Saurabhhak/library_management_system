// const superAdminMiddleware = (req, res, next) => {
//   try {
//     if (!req.user || req.user.role !== "superadmin") {
//       return res.status(403).json({
//         success: false,
//         message: "Only Super Admin allowed",
//       });
//     }

//     next();
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Authorization error",
//     });
//   }
// };
const superAdminMiddleware = (req, res, next) => {
  next(); 
};
module.exports = superAdminMiddleware;