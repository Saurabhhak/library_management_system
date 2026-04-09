import { Navigate } from "react-router-dom";

function SuperAdminRoute({ children }) {
  const role = localStorage.getItem("role");
  if (role !== "superadmin") return <Navigate to="/" replace />;
  return children;
}

export default SuperAdminRoute;
