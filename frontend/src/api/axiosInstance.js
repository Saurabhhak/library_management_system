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
const API = axios.create({
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
// Axios Automatically Token Send karta hai
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
