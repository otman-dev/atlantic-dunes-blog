import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log('Middleware triggered for:', pathname);
  console.log('Request headers cookies:', request.headers.get('cookie'));
  
  // Only protect admin routes (excluding login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    try {
      const response = NextResponse.next();
      const session = await getIronSession<SessionData>(request, response, sessionOptions);
      
      console.log('Session in middleware:', {
        isAuthenticated: session.isAuthenticated,
        userId: session.userId,
        username: session.username,
        sessionKeys: Object.keys(session)
      });
      
      // Check if session exists and is authenticated
      if (!session.isAuthenticated || !session.userId) {
        console.log('User not authenticated, redirecting to login');
        console.log('Session state:', session);
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
      
      console.log('User authenticated, proceeding to route');
      return response;
    } catch (error) {
      console.error('Middleware auth error:', error);
      // Redirect to login on any session error
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/posts/:path*', 
    '/admin/categories/:path*',
    '/admin/dashboard',
    '/admin/posts',
    '/admin/categories',
  ],
};
