import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";
export default function SuperAdminRoute() {
  const { isSuperAdmin, isAuthenticated, loading } = useAuth();
  if (loading) return <Loader />;
  if (isSuperAdmin) return <Outlet />;
  return <Navigate to={isAuthenticated ? "/home" : "/login"} replace />;
}
