import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is an admin route
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Get the session cookie
    const sessionCookie = request.cookies.get('atlantic-dunes-session');
    
    if (!sessionCookie) {
      if (pathname.startsWith('/api/')) {
        // For API routes, return 401
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      } else {
        // For page routes, redirect to login (unless already on login page)
        if (!pathname.includes('/login')) {
          return NextResponse.redirect(new URL('/admin/login', request.url));
        }
      }
    }
    
    // For API routes, let the route handler validate the session
    // For page routes, let them handle their own auth checks
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
