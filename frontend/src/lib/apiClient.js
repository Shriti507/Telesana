"use client";

import axios from "axios";
import { logout } from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:4000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
