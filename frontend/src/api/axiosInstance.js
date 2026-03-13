import axios from "axios";
/*
  ---- Central Axios Instance ----
  AXIOS INSTANCE (Single Source)
  Purpose:
  - Central API configuration
  - Single baseURL for all requests
  - Attach JWT token automatically
  - Easy to maintain and update
*/
// har API request me same configuration reuse ho sakti hai
// baar-baar URL likhne ki zarurat nahi
const API = axios.create({
  // Ye environment variable hai. for production deploy
  // Production me .env वाला URL use hoga
  // Development me localhost use hoga
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});
/*
  REQUEST INTERCEPTOR
  Flow:
  1. User logs in → backend sends JWT token
  2. Token stored in localStorage
  3. Every request automatically attaches token
  4. Backend middleware verifies token
*/
// Axios Automatically attaches token
// Jab bhi frontend API call karega, axios automatically token attach karega
// Axios interceptor automatically header add karega

// Browser se token read ho raha hai
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  // agar token mila header me attach
  if (token) {
    // Yaha token frontend se backend ko send ho raha hai
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
