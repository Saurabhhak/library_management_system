import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

/* REQUEST INTERCEPTOR */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && !config.url?.includes("/password")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* RESPONSE INTERCEPTOR (IMPORTANT) */
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token expired / invalid → logging out");

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      window.location.href = "/login"; // force reset
    }
    return Promise.reject(error);
  },
);

export default API;
