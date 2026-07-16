import axios from "axios";

const rawURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// This regex clean block strictly strips any trailing slashes from your base URL configuration entry
const cleanURL = rawURL.replace(/\/+$/, "");

const api = axios.create({
  baseURL: cleanURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

export default api;