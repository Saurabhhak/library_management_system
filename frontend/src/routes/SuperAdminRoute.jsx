import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SuperAdminRoute() {
  const { isSuperAdmin, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isSuperAdmin) return <Outlet />;
  return <Navigate to={isAuthenticated ? "/home" : "/login"} replace />;
}
