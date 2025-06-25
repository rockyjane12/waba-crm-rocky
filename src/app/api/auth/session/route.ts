import { NextRequest, NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    // Get CSRF token from header using Next.js headers() and cookies()
    const headersList = headers();
    const cookieStore = cookies();
    const headerToken = headersList.get("x-csrf-token");
    const cookieToken = cookieStore.get("csrf_token")?.value;
    
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
    const accessToken = cookieStore.get("sb-access-token")?.value;
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