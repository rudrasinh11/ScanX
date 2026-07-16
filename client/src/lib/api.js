import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

// An admin token can expire or become invalid after ADMIN_JWT_SECRET changes.
// Return the user to login instead of leaving protected admin views in a broken state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hasAdminSession = typeof window !== "undefined" && localStorage.getItem("adminToken");
    if (error?.response?.status === 401 && hasAdminSession) {
      localStorage.removeItem("adminToken");
      if (window.location.pathname !== "/admin/login") window.location.assign("/admin/login");
    }
    return Promise.reject(error);
  }
);

export default api;
