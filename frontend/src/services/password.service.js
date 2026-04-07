import API from "../api/axiosInstance";

/* ---------------- PASSWORD ---------------- */

// forgot password
export const forgotPassword = (email) =>
  API.post("/password/forgot-password", { email });

// reset password
export const resetPassword = (data) =>
  API.post("/password/reset-password", data);
