import axios from "axios";

const rawURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Cleans trailing slashes AND eliminates any accidental parentheses like ")"
const cleanURL = rawURL.replace(/[()]/g, "").replace(/\/+$/, "").trim();

const api = axios.create({
  baseURL: cleanURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

// Request Interceptor: Ensures the admin token accompanies data requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;