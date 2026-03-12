import API from "../api/axiosInstance";

/* Send OTP */
export const forgotPassword = (data) => {
  return API.post("/password/forgot-password", data);
};

/* Reset password (OTP middleware verify karega) */
export const resetPassword = (data) => {
  return API.post("/password/reset-password", data);
};
