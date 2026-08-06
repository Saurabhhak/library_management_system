import API from "../../api/axiosInstance";

/**
 * Unified login — role decides admin table vs member table on backend.
 * role: "admin" | "member"
 * Returns: { accessToken, user } — refreshToken set as httpOnly cookie automatically
 */
export const login = ({ email, password, role }) =>
  API.post("/auth/login", { email, password, role });

export const logout = () => API.post("/auth/logout");

export const getProfile = () => API.get("/auth/profile");

export const refreshAccessToken = () => API.post("/auth/refresh");