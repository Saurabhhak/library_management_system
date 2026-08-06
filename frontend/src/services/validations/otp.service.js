import API from "../../api/axiosInstance";

/**
 * Unified OTP service — ek hi function, dono roles ke liye.
 * role   : "admin" | "member"
 * purpose: "registration" | "password_reset"
 */

export const sendOtp = ({ email, role, purpose = "registration" }) =>
  API.post("/auth/send-otp", { email, role, purpose });

export const verifyOtp = ({ email, otp, role, purpose = "registration" }) =>
  API.post("/auth/verify-otp", { email, otp, role, purpose });

export const checkEmail = ({ email, role }) =>
  API.post("/auth/check-email", { email, role });