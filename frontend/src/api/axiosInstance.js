import axios from "axios";

/* ── LocalStorage keys ─────────────────────────── */
const ACCESS_KEY = "lms_access_token";
const REFRESH_KEY = "lms_refresh_token";

export const getAccessToken = () => localStorage.getItem(ACCESS_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

const normalizeApiBase = (url) => {
  const trimmed = url.replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const RAW_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
const BASE_URL = normalizeApiBase(RAW_BASE);

const API = axios.create({ baseURL: BASE_URL });

/* ── Attach access token on every request ── */
API.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];
const onPublicPage = () => PUBLIC_PATHS.includes(window.location.pathname);

const PUBLIC_AUTH_ENDPOINTS = [
  "/auth/refresh",
  "/auth/login",
  "/auth/register",
  "/auth/send-otp",
  "/auth/verify-otp",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/check-email",
];

/* ── Single shared in-flight refresh promise — avoids duplicate
   /auth/refresh calls (StrictMode double-effect race, multiple
   simultaneous 401s, etc). Exported so AuthContext can reuse it. ── */
let refreshPromise = null;

export function performRefresh() {
  if (refreshPromise) return refreshPromise;

  const refreshToken = getRefreshToken();
  if (!refreshToken) return Promise.reject(new Error("No refresh token"));

  refreshPromise = axios
    .post(`${BASE_URL}/auth/refresh`, { refreshToken }, { timeout: 8000 })
    .then(({ data }) => {
      setTokens(data.data.accessToken, data.data.refreshToken);
      return data.data.accessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

let queue = [];
const processQueue = (error, token = null) => {
  queue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token),
  );
  queue = [];
};

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (
      err.response?.status !== 401 ||
      original._retry ||
      PUBLIC_AUTH_ENDPOINTS.some((p) => original.url?.includes(p))
    ) {
      return Promise.reject(err);
    }

    if (refreshPromise) {
      return new Promise((resolve, reject) => queue.push({ resolve, reject }))
        .then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return API(original);
        })
        .catch((e) => Promise.reject(e));
    }

    original._retry = true;

    try {
      const token = await performRefresh();
      processQueue(null, token);
      original.headers.Authorization = `Bearer ${token}`;
      return API(original);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      clearTokens();
      if (!onPublicPage()) window.location.href = "/login";
      return Promise.reject(refreshErr);
    }
  },
);

export default API;