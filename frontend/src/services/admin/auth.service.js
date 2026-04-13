import API from "../../api/axiosInstance";

export const loginAdmin = (data) => API.post("/auth/login", data);

export const forgotPassword = (email) =>
  API.post("/password/forgot-password", { email });

export const resetPassword = (data) =>
  API.post("/password/reset-password", data);

export const checkEmailAPI = (data) => API.post("/auth/check-email", data);
