// client/src/services/axiosInstance.js

import axios from "axios";

// Global axios örneği
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Her istekten önce token'ı ekle (auth/register ve auth/onboard hariç)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Şu endpoint'lerde token ekleme
    const noAuthNeeded = ["/auth/register", "/auth/onboard", "/auth/login"];

    const isNoAuthRoute = noAuthNeeded.some((path) =>
      config.url?.includes(path)
    );

    if (token && !isNoAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
