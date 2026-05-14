import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

/**
 * SuperAdminRoute
 * Allowed roles : "superadmin" only
 * Everyone else → redirected to /
 *
 * Supports BOTH usage patterns:
 *
 *   Pattern A — nested Route wrapper (preferred, used in App.jsx):
 *     <Route element={<SuperAdminRoute />}>
 *       <Route path="/createadmin" element={<CreateAdmin />} />
 *     </Route>
 *
 *   Pattern B — inline children wrapper (legacy, still works):
 *     <Route path="/createadmin" element={
 *       <SuperAdminRoute><CreateAdmin /></SuperAdminRoute>
 *     } />
 */

const SuperAdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  /* No token */
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);

    /* Expired */
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return <Navigate to="/login" replace />;
    }

    /* Not superadmin */
    if (decoded.role !== "superadmin") {
      return <Navigate to="/" replace />;
    }

    /* children = Pattern B, undefined = Pattern A (Outlet) */
    return children ?? <Outlet />;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return <Navigate to="/login" replace />;
  }
};

export default SuperAdminRoute;
