import API from "../api/axiosInstance";

// Send OTP
export const forgotPassword = (email) =>
  API.post("/password/forgot-password", { email });

// Reset password
export const resetPassword = (data) =>
  API.post("/password/reset-password", data);

// Login route
export const loginAdmin = (data) => API.post("/auth/login", data);

// Email Check Exists
export const checkEmailAPI = (data) => {
  return API.post("/auth/check-email", data);
};
