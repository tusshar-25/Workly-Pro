// utils/axiosInstance.js
import axios from "axios";

// create axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // points to backend
  withCredentials: true, // needed if you use cookies (optional)
});

// add Authorization header if token present
axiosInstance.interceptors.request.use((config) => {
  // Try token from separate key first, then from stored user
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }
  const storedUser = localStorage.getItem("worklyUser");
  if (storedUser) {
    try {
      const { token: userToken } = JSON.parse(storedUser);
      if (userToken) config.headers.Authorization = `Bearer ${userToken}`;
    } catch (e) {
      // ignore
    }
  }
  return config;
});

export default axiosInstance;
