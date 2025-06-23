import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup', '/reset-password'];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // If the route is public, allow access
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return res;
  }

  // Check auth condition
  if (!session && !publicRoutes.includes(pathname)) {
    // Redirect to login page if accessing protected route without session
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Configure which routes to run the middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};