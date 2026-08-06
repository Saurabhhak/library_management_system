import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardPath } from "../utils/roleRoutes";

export default function AdminRoute() {
  const { isStaff, isMember, loading } = useAuth();
  if (loading) return null;
  if (isStaff) return <Outlet />;
  return <Navigate to={getDashboardPath({ isMember, isStaff })} replace />;
}
