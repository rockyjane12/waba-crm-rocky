import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    // Debug: Log cookies and env
    console.log("[SESSION API] Checking session");
    const requestHeaders = headers();
    const csrfToken = requestHeaders.get("x-csrf-token");
    console.log("[SESSION API] CSRF Token from header:", csrfToken);
    console.log("[SESSION API] CSRF_SECRET from env:", process.env.CSRF_SECRET);

    if (!csrfToken || csrfToken !== process.env.CSRF_SECRET) {
      console.error("[SESSION API] Invalid or missing CSRF token", { csrfToken, env: process.env.CSRF_SECRET });
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    // Create a server-side Supabase client
    const supabase = createServerSupabaseClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("[SESSION API] Supabase session error:", error);
      return NextResponse.json(
        { error: "Failed to get session" },
        { status: 500 }
      );
    }

    if (!session) {
      console.log("[SESSION API] No session found");
      return NextResponse.json({ user: null });
    }

    // Return only necessary user data
    const safeUserData = {
      id: session.user.id,
      email: session.user.email,
      lastSignInAt: session.user.last_sign_in_at,
    };
    console.log("[SESSION API] Returning user:", safeUserData);

    return NextResponse.json({
      user: safeUserData,
    });
  } catch (error) {
    console.error("[SESSION API] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}