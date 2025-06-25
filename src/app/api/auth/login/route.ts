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

    // Get CSRF tokens
    const headerToken = request.headers.get("x-csrf-token");
    const cookieToken = request.cookies.get("csrf_token")?.value;

    console.log("[LOGIN API] CSRF header token:", headerToken);
    console.log("[LOGIN API] CSRF cookie token:", cookieToken);
    
    // Validate CSRF token - header token should match cookie token
    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
      console.error("[LOGIN API] CSRF token mismatch");
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    console.log("[LOGIN API] Attempting Supabase login for email:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[LOGIN API] Supabase login error:", {
        timestamp: new Date().toISOString(),
        email: email.slice(0, 3) + "***",
        error: error.message,
        errorCode: error.status,
      });

      return NextResponse.json(
        { error: error.message },
        { status: error.status || 401 }
      );
    }

    if (!data.user || !data.session) {
      console.error("[LOGIN API] No user or session returned from Supabase");
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }

    console.log("[LOGIN API] Login successful for user:", data.user.id);

    // Create the response with the session
    const response = NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        lastSignInAt: data.user.last_sign_in_at,
      },
      session: {
        expires_at: data.session.expires_at,
      },
    });

    // Set Supabase session cookies
    const { access_token, refresh_token } = data.session;
    
    // Set access token cookie
    response.cookies.set('sb-access-token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    // Set refresh token cookie
    response.cookies.set('sb-refresh-token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Set auth event cookie for client-side detection
    response.cookies.set('sb-auth-event', 'SIGNED_IN', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 10, // Short-lived, just for event handling
    });

    console.log("[LOGIN API] Set session cookie and returning response");
    return response;
  } catch (error) {
    console.error("Unexpected error during login:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
