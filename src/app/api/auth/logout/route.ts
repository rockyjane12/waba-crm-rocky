import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    // Verify CSRF token from header and cookie
    const headerToken = request.headers.get("x-csrf-token");
    const cookieToken = request.cookies.get("csrf_token")?.value;

    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return NextResponse.json(
        { error: "Failed to logout" },
        { status: 500 }
      );
    }

    // Create response and clear auth cookies
    const response = NextResponse.json({ success: true });
    
    // Clear Supabase session cookies
    response.cookies.set('sb-access-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Expire immediately
    });
    
    response.cookies.set('sb-refresh-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Expire immediately
    });
    
    // Set auth event cookie for client-side detection
    response.cookies.set('sb-auth-event', 'SIGNED_OUT', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 10, // Short-lived, just for event handling
    });

    return response;
  } catch (error) {
    console.error("Unexpected logout error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}