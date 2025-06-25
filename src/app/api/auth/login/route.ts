import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { cookies, headers } from "next/headers";

// Rate limiter for login attempts
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    try {
      const ip = request.ip ?? "127.0.0.1";
      await limiter.check(5, ip); // 5 requests per minute per IP
    } catch {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Verify CSRF token from cookie
    const requestHeaders = headers();
    const csrfToken = requestHeaders.get("x-csrf-token");
    const csrfSecret = process.env.CSRF_SECRET;

    if (!csrfToken || csrfToken !== csrfSecret) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    // Create a server-side Supabase client
    const supabase = createServerSupabaseClient();

    // Attempt login with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Log error securely (avoid exposing sensitive details)
      console.error("Login error:", {
        timestamp: new Date().toISOString(),
        email: email.slice(0, 3) + "***", // Log partial email for debugging
        error: error.message,
      });

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Remove sensitive data before sending response
    const safeUserData = {
      id: data.user?.id,
      email: data.user?.email,
      lastSignInAt: data.user?.last_sign_in_at,
    };

    return NextResponse.json({
      user: safeUserData,
      session: {
        expires_at: data.session?.expires_at,
      },
    });
  } catch (error) {
    console.error("Unexpected error during login:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}