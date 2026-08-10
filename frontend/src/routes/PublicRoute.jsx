import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";

export default function PublicRoute() {
  const { isAuthenticated, isStaff, isMember, loading } = useAuth();

  // Suspend rendering while the authentication state is being verified
  if (loading) return <Loader />; 

  // Prevent logged-in users from accessing public forms (e.g., Login/Register)
  if (isAuthenticated) {
    if (isStaff) return <Navigate to="/home" replace />;
    if (isMember) return <Navigate to="/member/dashboard" replace />;
  }

  // Render the public route component
  return <Outlet />;
}