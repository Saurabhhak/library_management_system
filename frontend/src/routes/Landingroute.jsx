/**
 * LandingRoute.jsx
 *
 * Shows the Landing page to unauthenticated visitors.
 * If the user is already logged in, redirects them straight to /home (or "/").
 *
 * Usage in App.js:
 *   <Route path="/landing" element={<LandingRoute />} />
 *   — or make it the root route, see App.js integration below.
 */
import { Navigate, Outlet } from "react-router-dom";

/**
 * Replace this import with however your project exposes auth state.
 * Common patterns shown as comments below.
 */
// import { useAuth } from "../../context/AuthContext";        // context pattern
// import { useSelector } from "react-redux";                  // redux pattern
// const token = localStorage.getItem("token");               // local-storage pattern

function LandingRoute() {
  /**
   * ─── ADAPT THIS LINE to your auth system ───────────────────────────────
   * The only thing that matters is: isAuthenticated = true when logged in.
   *
   * Examples:
   *   const { user } = useAuth();          const isAuthenticated = !!user;
   *   const token = useSelector(s => s.auth.token);  const isAuthenticated = !!token;
   *   const isAuthenticated = !!localStorage.getItem("token");
   * ────────────────────────────────────────────────────────────────────────
   */
  const isAuthenticated = !!localStorage.getItem("token"); // ← change this line

  if (isAuthenticated) {
    // Already logged in → skip landing, go to dashboard
    return <Navigate to="/" replace />;
  }

  // Not logged in → render the child route (Landing page)
  return <Outlet />;
}

export default LandingRoute;
