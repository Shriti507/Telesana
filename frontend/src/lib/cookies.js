/**
 * Cookie helpers for the FRONTEND domain (vercel.app).
 *
 * WHY THIS EXISTS:
 * The backend (onrender.com) sets an httpOnly cookie for secure API calls.
 * But Next.js middleware runs on Vercel's edge and can ONLY read cookies
 * belonging to the vercel.app domain — it can never see the onrender.com cookie.
 *
 * So after a successful login/signup we also store the JWT in a cookie on
 * the frontend domain. The middleware reads this copy for routing decisions.
 * The httpOnly backend cookie is still used for all actual API requests.
 */

const COOKIE_NAME = "auth_token";
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

/**
 * Store the JWT on the frontend domain so Next.js middleware can read it.
 */
export function setFrontendAuthCookie(token) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

/**
 * Remove the frontend auth cookie (call on logout).
 */
export function clearFrontendAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
