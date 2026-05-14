  // frontend/src/services/auth/memberAuth.service.js
  import API from "../../api/axiosInstance";

  // ── Registration ──────────────────────────────────────────
  export const sendOTP        = (email)      => API.post("/auth/register/send-otp",   { email });
  export const verifyOTP      = (email, otp) => API.post("/auth/register/verify-otp",  { email, otp });
  export const registerMember = (data)       => API.post("/auth/register/complete",     data);

  // ── Login ─────────────────────────────────────────────────
  export const memberLogin = (email, password) => API.post("/auth/login", { email, password });

  // ── Forgot / Reset Password ───────────────────────────────
  export const forgotPassword  = (email)                     => API.post("/auth/forgot-password",  { email });
  export const verifyResetOTP  = (email, otp)                => API.post("/auth/verify-reset-otp", { email, otp });
  export const resetPassword   = (reset_token, new_password) => API.post("/auth/reset-password",   { reset_token, new_password });

  // ── Google OAuth ─────────────────────────────────────────
  
  // No axios needed – just redirect the browser to backend
  export const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };
