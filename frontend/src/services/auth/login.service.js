import API from "../../api/axiosInstance";

/**
 * Unified login — NO role param. Backend auto-detects admin vs member
 * by checking both tables. Response includes `user.role` so the
 * frontend knows where to redirect after login.
 */
export const login = ({ email, password }) =>
  API.post("/auth/login", { email, password });

export const logout = () => API.post("/auth/logout");

export const getProfile = () => API.get("/auth/profile");

export const refreshAccessToken = () => API.post("/auth/refresh");
