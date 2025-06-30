import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { rateLimit } from "@/lib/rate-limit";

// Rate limiter for login attempts
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

export async function POST(request: Request) {
  try {
    // Rate limiting
    try {
      const headersList = headers();
      const ip = headersList.get('x-forwarded-for') ?? "127.0.0.1";
      await limiter.check(5, ip); // 5 requests per minute per IP
    } catch {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

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

      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Remove sensitive data before sending response
    const safeUserData = {
      id: data.user?.id,
      email: data.user?.email,
      lastSignInAt: data.user?.last_sign_in_at,
    };

    const response = NextResponse.json({
      user: safeUserData,
      session: {
        expires_at: data.session?.expires_at,
      },
    });

    return response;
  } catch (error: any) {
    console.error("Unexpected error during login:", error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during login' },
      { status: 500 }
    );
  }
}
