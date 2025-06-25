import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Debug: Log cookies and env
    console.log("[SESSION API] Cookies:", request.cookies);
    const csrfToken = request.cookies.get("csrf_token")?.value;
    console.log("[SESSION API] CSRF Token from cookie:", csrfToken);
    console.log("[SESSION API] CSRF_SECRET from env:", process.env.CSRF_SECRET);

    if (!csrfToken || csrfToken !== process.env.CSRF_SECRET) {
      console.error("[SESSION API] Invalid or missing CSRF token", { csrfToken, env: process.env.CSRF_SECRET });
      return NextResponse.json(
        { error: "Invalid CSRF token", debug: { csrfToken, env: process.env.CSRF_SECRET } },
        { status: 403 }
      );
    }

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error("[SESSION API] Supabase session error:", error);
      return NextResponse.json(
        { error: "Failed to get session", debug: error },
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
      { error: "An unexpected error occurred", debug: error },
      { status: 500 }
    );
  }
}
