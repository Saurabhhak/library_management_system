// src/routes/SuperAdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SuperAdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === "superadmin" ? children : <Navigate to="/" replace />;
};

export default SuperAdminRoute;