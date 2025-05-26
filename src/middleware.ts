import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log('🔍 Middleware triggered for:', pathname);
  console.log('🌍 Environment:', process.env.NODE_ENV);
  console.log('🍪 Request cookies:', request.headers.get('cookie'));
  console.log('🔑 Has SESSION_SECRET:', !!process.env.SESSION_SECRET);
  console.log('🏠 Vercel URL:', process.env.VERCEL_URL);
  
  // Only protect admin routes (excluding login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    try {
      console.log('🔐 Checking authentication for protected route:', pathname);
      
      const response = NextResponse.next();
      const session = await getIronSession<SessionData>(request, response, sessionOptions);
      
      console.log('📊 Session details:', {
        isAuthenticated: session.isAuthenticated,
        userId: session.userId,
        username: session.username,
        role: session.role,
        sessionKeys: Object.keys(session),
        sessionStringified: JSON.stringify(session),
        cookieOptions: sessionOptions.cookieOptions
      });
      
      // More comprehensive authentication check
      const isSessionValid = session.isAuthenticated === true && 
                           session.userId && 
                           session.username;
      
      if (!isSessionValid) {
        console.log('❌ User not authenticated or session invalid');
        console.log('📝 Session validation details:', {
          isAuthenticated: session.isAuthenticated,
          hasUserId: !!session.userId,
          hasUsername: !!session.username,
          fullSession: session
        });
        
        const loginUrl = new URL('/admin/login', request.url);
        const redirectResponse = NextResponse.redirect(loginUrl);
        
        // Clear any corrupted session cookie
        redirectResponse.cookies.delete('atlantic-dunes-session');
        
        return redirectResponse;
      }
      
      console.log('✅ User authenticated successfully:', {
        userId: session.userId,
        username: session.username,
        role: session.role
      });
      
      return response;
      
    } catch (error) {
      console.error('💥 Middleware auth error:', error);
      console.error('📋 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
      
      // Redirect to login on any session error
      const loginUrl = new URL('/admin/login', request.url);
      const redirectResponse = NextResponse.redirect(loginUrl);
      
      // Clear any corrupted session cookie
      redirectResponse.cookies.delete('atlantic-dunes-session');
      
      return redirectResponse;
    }
  }

  console.log('⏭️ Route does not require authentication, proceeding');
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
