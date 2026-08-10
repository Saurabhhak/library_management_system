import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardPath } from "../utils/roleRoutes";
import Loader from "../components/common/Loader";

export default function AdminRoute() {
  const { isStaff, isMember, loading } = useAuth();
  if (loading) return <Loader />;
  if (isStaff) return <Outlet />;
  return <Navigate to={getDashboardPath({ isMember, isStaff })} replace />;
}
