import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_SECRET = process.env.CSRF_SECRET || "default_secret";

function generateRandomHex(size: number): string {
  const array = new Uint8Array(size);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Check if CSRF cookie is already set
  const csrfCookie = request.cookies.get(CSRF_COOKIE_NAME);

  if (!csrfCookie) {
    // Generate a new CSRF token using Web Crypto API
    const token = generateRandomHex(32);

    // Set the CSRF token cookie
    response.cookies.set({
      name: CSRF_COOKIE_NAME,
      value: token,
      httpOnly: false, // Allow client JS to read it
      secure: false, // Allow HTTP in development
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
    });

    // Log token being set for debugging
    console.log('[MIDDLEWARE] Setting CSRF token:', token);
  }

  return response;
}

// Run middleware on all routes except static files and favicon
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
