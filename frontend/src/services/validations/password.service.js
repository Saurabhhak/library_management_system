import API from "../../api/axiosInstance";

/**
 * Unified password service — ek hi function, dono roles ke liye.
 * role: "admin" | "member"
 */

export const forgotPassword = ({ email, role }) =>
  API.post("/auth/forgot-password", { email, role });

export const resetPassword = ({ email, otp, password, role }) =>
  API.post("/auth/reset-password", { email, otp, password, role });