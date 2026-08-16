import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axiosInstance, {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  performRefresh,
} from "../api/axiosInstance";

const AuthContext = createContext(null);

function readValidToken() {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    // JWT exp is in seconds, Date.now() is in ms
    if (decoded.exp * 1000 < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const decoded = readValidToken();

      // Fast UI mount using valid access token
      if (decoded) {
        if (!cancelled) {
          setUser({
            id: decoded.id,
            role: decoded.role,
            userType: decoded.userType,
            email: decoded.email,
          });
          setLoading(false);
        }

        // Background sync to get full profile
        axiosInstance
          .get("/auth/profile")
          .then(({ data }) => {
            const profileData = data.data || data.user || data;
            if (!cancelled) setUser(profileData);
          })
          .catch(() => {});
        return;
      }

      // If no valid access token, try refresh
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        await performRefresh();
        const { data } = await axiosInstance.get("/auth/profile");
        const profileData = data.data || data.user || data;
        if (!cancelled) setUser(profileData);
      } catch {
        if (!cancelled) clearTokens();
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  function login(accessToken, refreshToken, userData) {
    setTokens(accessToken, refreshToken);
    setUser(userData);
  }

  async function logout() {
    try {
      await axiosInstance.post("/auth/logout", {
        refreshToken: getRefreshToken(),
      });
    } catch {
      // Ignore network errors, proceed with local logout
    } finally {
      clearTokens();
      setUser(null);
    }
  }

  function updateUser(partial) {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  }

  const role = user?.role; // 'admin' table or 'member' table distinction

  const value = {
    user,
    loading,
    isAuthenticated: !!user,

    // Admin Side Roles (librarian added to staff array logically)
    isSuperAdmin: role === "superadmin",
    isAdmin: role === "admin" || role === "superadmin",
    isLibrarian: role === "librarian",
    isStaff: ["admin", "superadmin", "librarian"].includes(role),

    // Member Side Roles
    isMember: role === "member", // Pure Student/Teacher/Professor

    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
