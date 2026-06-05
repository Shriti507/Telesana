"use client";

import { clearFrontendAuthCookie } from "./cookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:4000";

export async function getCurrentUser() {
  console.log("[auth] Calling GET /api/auth/me ...");
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    console.log("[auth] /api/auth/me → status:", response.status);

    if (!response.ok) {
      console.log("[auth] /api/auth/me failed → not authenticated");
      return null;
    }

    const data = await response.json().catch(() => ({}));
    console.log("[auth] getCurrentUser → user:", data.user);
    return data.user || null;
  } catch (err) {
    console.error("[auth] getCurrentUser error:", err);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  console.log("[auth] isAuthenticated →", Boolean(user));
  return Boolean(user);
}

export async function logout() {
  console.log("[auth] Logging out...");
  // Clear the frontend routing cookie (auth_token on vercel.app domain)
  clearFrontendAuthCookie();
  // Clear the backend httpOnly cookie (token on onrender.com domain)
  await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => null);
  console.log("[auth] Logout done");
}
