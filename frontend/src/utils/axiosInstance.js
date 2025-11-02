// utils/axiosInstance.js
import axios from "axios";

// create axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // points to backend
  withCredentials: true, // needed if you use cookies (optional)
});

// add Authorization header if token present
axiosInstance.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("worklyUser");
  if (storedUser) {
    try {
      const { token } = JSON.parse(storedUser);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      /* ignore JSON parse errors */
    }
  }
  return config;
});

export default axiosInstance;
