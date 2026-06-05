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
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  console.log(
    `[Middleware] pathname=${pathname} | hasToken=${!!token} | tokenValid=${isTokenValid(token)}`
  );

  if (pathname.startsWith("/dashboard") && !isTokenValid(token)) {
    console.log(
      `[Middleware] No valid token for ${pathname} → redirecting to /login`
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
