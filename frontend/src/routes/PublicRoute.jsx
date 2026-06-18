import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PublicRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) return <Outlet />;

  try {
    const decoded = jwtDecode(token);

    // Token expired → allow login
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return <Outlet />;
    }

    // Token valid → redirect to dashboard
    return <Navigate to="/home"  replace />;
  } catch (err) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return <Outlet />;
  }
};

export default PublicRoute;