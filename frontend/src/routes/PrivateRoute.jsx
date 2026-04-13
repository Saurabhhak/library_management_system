  import { Navigate, Outlet } from "react-router-dom";
  import { jwtDecode } from "jwt-decode";

  const PrivateRoute = () => {
    const token = localStorage.getItem("token");

    // ❌ No token → go login
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    try {
      const decoded = jwtDecode(token);

      // ❌ Token expired
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        return <Navigate to="/login" replace />;
      }

      // ✅ OK → allow access
      return <Outlet />;
    } catch (error) {
      console.error("Token decode error:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      return <Navigate to="/login" replace />;
    }
  };

  export default PrivateRoute;