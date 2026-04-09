import API from "../../api/axiosInstance";
// otp.service.js FINAL

export const sendOtpAPI = (data) =>
  API.post("/auth/send-otp", data);

export const verifyOtpAPI = (data) =>
  API.post("/auth/verify-otp", data);