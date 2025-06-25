import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { randomBytes } from "crypto";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_SECRET = process.env.CSRF_SECRET || "default_secret";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Check if CSRF cookie is already set
  const csrfCookie = request.cookies.get(CSRF_COOKIE_NAME);

  if (!csrfCookie) {
    // Generate a new CSRF token
    const token = randomBytes(32).toString("hex");

    // Set the CSRF token cookie with HttpOnly and Secure flags
    response.cookies.set({
      name: CSRF_COOKIE_NAME,
      value: token,
      httpOnly: false, // Allow client JS to read it
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    });
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
