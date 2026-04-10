import axios from "axios";

/* ______________BASE URL ______________*/
// env me sirf domain rahe (no /api)
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* ______________AXIOS INSTANCE ______________*/
const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

/* ______________REQUEST INTERCEPTOR ______________*/
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    // old logic (simple & working)
    if (token && !config.url?.includes("/password")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// /* ______________RESPONSE INTERCEPTOR ______________*/
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // optional safety (production friendly)
//     if (error.response?.status === 401) {
//       console.warn("Unauthorized - token removed");
//       localStorage.removeItem("token");
//     }
//     return Promise.reject(error);
//   }
// );

export default API;
