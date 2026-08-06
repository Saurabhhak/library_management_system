import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function MemberRoute() {
  const { isMember, isStaff, loading } = useAuth();
  if (loading) return null;
  if (isMember) return <Outlet />;
  return <Navigate to={isStaff ? "/home" : "/login"} replace />;
}
