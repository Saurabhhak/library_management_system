import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";

export default function LandingRoute() {
  const { isAuthenticated, isStaff, isMember, loading } = useAuth();

  // Suspend rendering while the authentication state is being verified
  if (loading) return <Loader />; 

  // Redirect logged-in users directly to their respective dashboards
  if (isAuthenticated) {
    if (isStaff) return <Navigate to="/home" replace />;
    if (isMember) return <Navigate to="/member/dashboard" replace />;
  }

  // Render the public landing page for unauthenticated visitors
  return <Outlet />;
}