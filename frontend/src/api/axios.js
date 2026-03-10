import axios from "axios";

/*
  CENTRAL AXIOS INSTANCE
  All API calls in the project will use this instance.
  This ensures:
  - single baseURL
  - automatic token attachment
  - easier maintenance
*/

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

/*
  AUTH FLOW
  1. User logs in → backend returns JWT token
  2. Token stored in localStorage
  3. Axios interceptor attaches token automatically
  4. Backend verifies token
*/

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
// Request to Backend middleware token verify karta hai
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
