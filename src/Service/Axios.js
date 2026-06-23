import axios from "axios";

const BASE_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_URL ||
    "https://mern-e-comress-by-abirullah-backend.vercel.app/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Attach stored token (if any) on each request
API.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem("userInfo");
      if (stored) {
        const user = JSON.parse(stored);
        if (user?.token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (e) {
      // ignore parse errors
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Global response handler: if backend returns 401/403, clear local credentials and redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      try {
        localStorage.removeItem("userInfo");
      } catch (e) {
        // ignore
      }
      // safe redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;

export const getApiErrorMessage = (error, fallback = "Something went wrong") => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};
