// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://sadn-learn-backend.onrender.com/api", // Adjust this if your server is hosted elsewhere
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to each request (optional, for authenticated routes)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
