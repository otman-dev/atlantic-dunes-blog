import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

export async function middleware(request: NextRequest) {
  console.log('Middleware triggered for:', request.nextUrl.pathname);
  
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    try {
      const response = NextResponse.next();
      const session = await getIronSession<SessionData>(request, response, sessionOptions);
      
      console.log('Session in middleware:', {
        isAuthenticated: session.isAuthenticated,
        userId: session.userId,
        username: session.username
      });
      
      if (!session.isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
        // Redirect to login page
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      
      console.log('User authenticated, proceeding to route');
      return response;
    } catch (error) {
      console.error('Middleware auth error:', error);
      // Redirect to login on any session error
      return NextResponse.redirect(new URL('/admin/login', request.url));
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
