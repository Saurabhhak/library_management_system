import API from "../../api/axiosInstance";

/**
 * Unified password service — NO role param. Backend auto-detects
 * admin vs member by checking both tables.
 */

export const forgotPassword = ({ email }) =>
  API.post("/auth/forgot-password", { email });

export const resetPassword = ({ email, otp, password }) =>
  API.post("/auth/reset-password", { email, otp, password });

export const forgotInstitutionalId = ({ email }) =>
  API.post("/auth/forgot-id", { email });
