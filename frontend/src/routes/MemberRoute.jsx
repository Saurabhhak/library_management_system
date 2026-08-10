import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";
export default function MemberRoute() {
  const { isMember, isStaff, loading } = useAuth();
  if (loading) return <Loader />;
  if (isMember) return <Outlet />;
  return <Navigate to={isStaff ? "/home" : "/login"} replace />;
}
