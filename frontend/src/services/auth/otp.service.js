import API from "../../api/axiosInstance";

/**
 * OTP service — still takes `role` because this is only used during
 * REGISTRATION (member self-register or superadmin creating an admin),
 * where the target table is already known from context. This is
 * different from login/forgot-password, which are role-less.
 */

export const sendOtp = ({ email, role, purpose = "registration" }) =>
  API.post("/auth/send-otp", { email, role, purpose });

export const verifyOtp = ({ email, otp, role, purpose = "registration" }) =>
  API.post("/auth/verify-otp", { email, otp, role, purpose });

export const checkEmail = ({ email, role }) =>
  API.post("/auth/check-email", { email, role });
