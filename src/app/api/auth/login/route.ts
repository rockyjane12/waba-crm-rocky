import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";
import { createHash } from "crypto";

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

    // Hash password before sending to Supabase
    // This adds an extra layer of security during transmission
    const hashedPassword = createHash("sha256")
      .update(password)
      .digest("hex");

    // Verify CSRF token from cookie
    const csrfToken = request.cookies.get("csrf_token")?.value;

    if (!csrfToken || csrfToken !== process.env.CSRF_SECRET) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    // Attempt login with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: hashedPassword,
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
