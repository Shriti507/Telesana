import { NextResponse } from "next/server";

function decodeJwtPayload(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}

function isTokenValid(token) {
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return false;
  return payload.exp * 1000 > Date.now();
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Read the FRONTEND-domain cookie (set by the browser after login via document.cookie).
  // This is "auth_token" — NOT the httpOnly "token" cookie from the backend.
  // The backend's httpOnly cookie belongs to onrender.com and is invisible here on Vercel edge.
  const token = request.cookies.get("auth_token")?.value;

  const tokenValid = isTokenValid(token);

  console.log(
    `[Middleware] pathname=${pathname} | hasToken=${!!token} | tokenValid=${tokenValid}`
  );

  if (pathname.startsWith("/dashboard") && !tokenValid) {
    console.log(
      `[Middleware]  No valid auth_token → redirecting to /login`
    );
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  console.log(`[Middleware] Access granted to ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
