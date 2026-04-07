import axios from "axios";

/* -------------------------------------------------------
   AXIOS INSTANCE  ·  Production Ready
   baseURL = REACT_APP_API_URL + "/api"
   REACT_APP_API_URL must NOT have a trailing slash or /api
------------------------------------------------------- */
const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: `${BASE}/api`,
  withCredentials: true,
});

/* -------------------------------------------------------
   REQUEST INTERCEPTOR — attach JWT automatically
------------------------------------------------------- */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  const publicRoutes = [
    "/auth/login",
    "/auth/google",
    "/auth/send-otp",
    "/auth/verify-otp",
    "/auth/check-email",
    "/password",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    config.url.includes(route),
  );

  if (token && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* -------------------------------------------------------
   RESPONSE INTERCEPTOR — auto-logout on 401
------------------------------------------------------- */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default API;
