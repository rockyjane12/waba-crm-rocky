import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
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
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return NextResponse.json(
        { error: "Failed to logout" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected logout error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}