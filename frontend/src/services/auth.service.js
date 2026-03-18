import API from "../api/axiosInstance";

// Send OTP
export const forgotPassword = (email) => 
  API.post("/password/forgot-password", { email });

// Reset password
export const resetPassword = (data) =>
  API.post("/password/reset-password", data);