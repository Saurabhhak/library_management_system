import { Navigate } from "react-router-dom";

const SuperAdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");

  if (role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default SuperAdminRoute;

// const SuperAdminRoute = ({ children }) => {
//   // TEMP BYPASS
//   return children;
// };

// export default SuperAdminRoute;