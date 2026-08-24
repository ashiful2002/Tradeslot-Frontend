import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,  
  headers: {
    "Content-Type": "application/json",
  },
});

// Fallback token interceptor if stored in localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("tradeslot_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
