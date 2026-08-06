import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axiosInstance, {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  performRefresh, // ← ye naya import missing hai aapki file me
} from "../api/axiosInstance";

const AuthContext = createContext(null);

function readValidToken() {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
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
        axiosInstance
          .get("/auth/profile")
          .then(({ data }) => !cancelled && setUser(data.data))
          .catch(() => {});
        return;
      }

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        // ← YE badla hai: seedha axiosInstance.post ki jagah shared
        //    performRefresh() — StrictMode ke dono effect-runs isi
        //    EK in-flight promise ka wait karte hain.
        await performRefresh();
        const { data: profile } = await axiosInstance.get("/auth/profile");
        if (!cancelled) setUser(profile.data);
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
      // ignore
    } finally {
      clearTokens();
      setUser(null);
    }
  }

  function updateUser(partial) {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  }

  const role = user?.role;

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isSuperAdmin: role === "superadmin",
    isAdmin: role === "admin" || role === "superadmin",
    isLibrarian: role === "librarian",
    isStaff: ["admin", "superadmin", "librarian", "staff"].includes(role),
    isMember: role === "member",
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
