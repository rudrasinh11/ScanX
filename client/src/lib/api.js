import axios from "axios";

const rawURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Cleans trailing slashes AND eliminates any accidental trailing parentheses like ")" 
const cleanURL = rawURL.replace(/[()]/g, "").replace(/\/+$/, "").trim();

const api = axios.create({
  baseURL: cleanURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

export default api;