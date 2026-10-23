// src/api.js
// One place for: API url, JWT attach, silent refresh, session helpers.
// The interceptors are installed on the GLOBAL axios too, so every existing
// `axios.get("https://.../api/...")` call in the pages automatically sends the JWT.
import axios from "axios";

const LEGACY_BASE = "https://e-commerce-app-8jg4.onrender.com";
export const API_BASE = (import.meta.env.VITE_API_URL || LEGACY_BASE).replace(/\/$/, "");

// Endpoints that must NOT carry a token (an expired token would make them 401)
const PUBLIC_PATHS = [
  "/api/login/",
  "/api/google-login/",
  "/api/register/",
  "/api/send-otp/",
  "/api/verify-otp/",
  "/api/verify-register-otp/",
  "/api/forgot-password-otp/",
  "/api/reset-password/",
  "/api/token/refresh/",
  "/api/products/",
  "/api/health/",
];

// Pages that need a login (used for redirect after a failed refresh)
export const PROTECTED_PATHS = [
  "/cart", "/liked", "/payment", "/orders", "/profile", "/profilechange", "/success", "/upload",
];

const isApiUrl = (url = "") => url.startsWith(API_BASE) || url.startsWith(LEGACY_BASE) || url.startsWith("/api/");
const isPublic = (url = "") => PUBLIC_PATHS.some((p) => url.includes(p));

/* ---------------- session storage helpers ---------------- */
const read = (k) => sessionStorage.getItem(k) ?? localStorage.getItem(k);

export const getAccess = () => read("access");
export const getRefresh = () => read("refresh");

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const isAuthenticated = () => Boolean(getRefresh() || getAccess());
export const isAdmin = () => getUser()?.role === "admin";

const CACHE_KEYS = ["likes", "cart", "orders", "cartCount", "registerData", "otpVerified"];

export const clearSession = () => {
  ["access", "refresh"].forEach((k) => {
    sessionStorage.removeItem(k);
    localStorage.removeItem(k);
  });
  ["user", "session_only", ...CACHE_KEYS].forEach((k) => localStorage.removeItem(k));
  window.dispatchEvent(new Event("auth:changed"));
};

// remember === false  -> tokens live only for this browser session
export const saveSession = (data, remember = true) => {
  const store = remember ? localStorage : sessionStorage;
  const other = remember ? sessionStorage : localStorage;

  other.removeItem("access");
  other.removeItem("refresh");
  store.setItem("access", data.access);
  store.setItem("refresh", data.refresh);

  if (remember) localStorage.removeItem("session_only");
  else localStorage.setItem("session_only", "1");

  localStorage.setItem(
    "user",
    JSON.stringify({
      username: data.username,
      email: data.email,
      role: data.role,
      is_staff: data.is_staff,
      image: data.image || null,
    })
  );
  window.dispatchEvent(new Event("auth:changed"));
};

// "Remember me" unchecked + browser was closed -> sessionStorage is empty -> log out
if (localStorage.getItem("session_only") && !sessionStorage.getItem("refresh")) {
  clearSession();
}

/* ---------------- request: attach token ---------------- */
const attachToken = (config) => {
  const token = getAccess();
  if (token && isApiUrl(config.url) && !isPublic(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

/* ---------------- response: refresh once on 401 ---------------- */
// Refresh tokens rotate + get blacklisted, so two parallel refreshes would break each
// other. Keep a single in-flight promise and let every request wait for it.
let refreshing = null;

const refreshAccess = () => {
  if (!refreshing) {
    refreshing = axios
      .post(`${API_BASE}/api/token/refresh/`, { refresh: getRefresh() })
      .then(({ data }) => {
        const store = localStorage.getItem("session_only") ? sessionStorage : localStorage;
        store.setItem("access", data.access);
        if (data.refresh) store.setItem("refresh", data.refresh);
        return data.access;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
};

const onUnauthorized = async (err) => {
  const original = err.config;

  const canRetry =
    err.response?.status === 401 &&
    original &&
    !original._retry &&
    isApiUrl(original.url) &&
    !isPublic(original.url) &&
    getRefresh();

  if (!canRetry) return Promise.reject(err);

  original._retry = true;
  try {
    const access = await refreshAccess();
    original.headers.Authorization = `Bearer ${access}`;
    return axios(original);
  } catch (refreshErr) {
    clearSession();
    if (PROTECTED_PATHS.some((p) => window.location.pathname.startsWith(p))) {
      window.location.assign("/login?expired=1");
    }
    return Promise.reject(refreshErr);
  }
};

axios.interceptors.request.use(attachToken);
axios.interceptors.response.use((r) => r, onUnauthorized);

/* ---------------- api instance for new code ---------------- */
const api = axios.create({ baseURL: `${API_BASE}/api` });
api.interceptors.request.use((config) => {
  // baseURL is relative to /api, so build an absolute-looking url for the checks
  const url = `/api${config.url?.startsWith("/") ? "" : "/"}${config.url || ""}`;
  const token = getAccess();
  if (token && !isPublic(url)) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use((r) => r, async (err) => {
  const original = err.config;
  const url = `/api${original?.url?.startsWith("/") ? "" : "/"}${original?.url || ""}`;
  if (err.response?.status === 401 && original && !original._retry && !isPublic(url) && getRefresh()) {
    original._retry = true;
    try {
      const access = await refreshAccess();
      original.headers.Authorization = `Bearer ${access}`;
      return api(original);
    } catch (e) {
      clearSession();
      if (PROTECTED_PATHS.some((p) => window.location.pathname.startsWith(p))) {
        window.location.assign("/login?expired=1");
      }
      return Promise.reject(e);
    }
  }
  return Promise.reject(err);
});

/* ---------------- actions ---------------- */
export const logout = async () => {
  try {
    await api.post("/logout/", { refresh: getRefresh() });
  } catch {
    /* token already invalid - nothing to do */
  }
  clearSession();
};

// A plain <a href> can't send the Authorization header, so fetch as a blob.
export const downloadInvoice = async (orderId) => {
  const res = await api.get(`/invoice/${orderId}/`, { responseType: "blob" });
  const url = URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = `invoice_${orderId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export default api;
