import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

/**
 * AdminRoute
 * Allowed roles : "admin" | "superadmin"
 * Members       → redirected to /library
 * Expired token → redirected to /login
 *
 * Uses <Outlet /> so it works as a nested Route wrapper:
 *   <Route element={<AdminRoute />}>
 *     <Route path="/bookinventory" element={<BookInventory />} />
 *   </Route>
 */

const ALLOWED = ["admin", "superadmin"];

const AdminRoute = () => {
  const token = localStorage.getItem("token");

  /* No token at all */
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);

    /* Expired */
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return <Navigate to="/login" replace />;
    }

    /* Wrong role — member trying to hit admin route */
    if (!ALLOWED.includes(decoded.role)) {
      return <Navigate to="/library" replace />;
    }

    return <Outlet />;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
