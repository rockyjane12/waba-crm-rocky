import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    // Get CSRF token from header
    const headerToken = request.headers.get("x-csrf-token");
    const cookieToken = request.cookies.get("csrf_token")?.value;
    
    console.log("[SESSION API] CSRF header token:", headerToken);
    console.log("[SESSION API] CSRF cookie token:", cookieToken);
    
    // Validate CSRF token - header token should match cookie token
    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
      console.error("[SESSION API] CSRF token mismatch", { 
        headerToken, 
        cookieToken,
        match: headerToken === cookieToken 
      });
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    // Get Supabase access token from cookie
    const accessToken = request.cookies.get("sb-access-token")?.value;
    if (!accessToken) {
      console.log("[SESSION API] No Supabase access token found in cookies");
      return NextResponse.json({ user: null });
    }

    // Create Supabase client with access token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error("[SESSION API] Supabase getUser error:", error);
      return NextResponse.json(
        { error: "Failed to get user", debug: error },
        { status: 500 }
      );
    }

    if (!user) {
      console.log("[SESSION API] No user found");
      return NextResponse.json({ user: null });
    }

    // Return only necessary user data
    const safeUserData = {
      id: user.id,
      email: user.email,
      lastSignInAt: user.last_sign_in_at,
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