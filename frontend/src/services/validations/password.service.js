import API from "../../api/axiosInstance";

export const forgotPassword = (email) =>
  API.post("/password/forgot-password", { email });

export const resetPassword = (data) =>
  API.post("/password/reset-password", data);
