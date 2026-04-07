import API from "../../api/axiosInstance";

/* --------------------------------
   AUTH SERVICE - Production Ready
   Handles:
   - Login
   - Google Auth
   - Email Check
   - OTP (Future Ready)
-------------------------------- */

/* ---------------- LOGIN ---------------- */

// Admin login
export const loginAdmin = (data) => API.post("/auth/login", data);

/* ---------------- GOOGLE AUTH ---------------- */

// Redirect handled in frontend (no API call here)
// This is just helper if needed in future
export const getGoogleAuthUrl = (inviteToken) =>
  `${process.env.REACT_APP_API_URL}/auth/google?inviteToken=${inviteToken}`;

/* ---------------- EMAIL VALIDATION ---------------- */

// Check if email already exists
export const checkEmailExists = (data) => API.post("/auth/check-email", data);

/* ---------------- OTP (Optional / Future) ---------------- */

// Send OTP
export const sendOtp = (data) => API.post("/auth/send-otp", data);

// Verify OTP
export const verifyOtp = (data) => API.post("/auth/verify-otp", data);
