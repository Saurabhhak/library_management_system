import API from "../../api/axiosInstance";

/**
 * Unified login — NO role param. Backend auto-detects admin vs member
 * by checking both tables. Evaluates both Email OR Institutional ID.
 */
export const login = ({ email, password }) => {
  return API.post("/auth/login", { email, password });
};

export const logout = () => {
  return API.post("/auth/logout");
};

export const getProfile = () => {
  return API.get("/auth/profile");
};

export const refreshAccessToken = () => {
  return API.post("/auth/refresh");
};
