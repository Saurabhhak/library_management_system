import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardPath } from "../utils/roleRoutes";

export default function PublicRoute() {
  const { isAuthenticated, isMember, isStaff, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated)
    return <Navigate to={getDashboardPath({ isMember, isStaff })} replace />;
  return <Outlet />;
}
