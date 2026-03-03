import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  try {
    const decoded = jwtDecode(token);
    // exp is in seconds → convert to ms
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
    return <Outlet />;
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};
export default PrivateRoute;
