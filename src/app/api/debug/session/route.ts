import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug session request received');
    
    const response = NextResponse.json({ debug: true });
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL_URL,
      vercelUrl: process.env.VERCEL_URL,
      hasSessionSecret: !!process.env.SESSION_SECRET,
      sessionSecretLength: process.env.SESSION_SECRET?.length || 0,
      cookies: request.headers.get('cookie'),
      sessionData: {
        isAuthenticated: session.isAuthenticated,
        userId: session.userId,
        username: session.username,
        role: session.role,
        fullSession: JSON.stringify(session)
      },
      sessionOptions: {
        cookieName: sessionOptions.cookieName,
        secure: sessionOptions.cookieOptions?.secure,
        httpOnly: sessionOptions.cookieOptions?.httpOnly,
        sameSite: sessionOptions.cookieOptions?.sameSite,
        maxAge: sessionOptions.cookieOptions?.maxAge,
        path: sessionOptions.cookieOptions?.path,
        domain: sessionOptions.cookieOptions?.domain,
        ttl: sessionOptions.ttl
      }
    };

    console.log('📊 Debug info:', debugInfo);

    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('💥 Debug session error:', error);
    return NextResponse.json({ 
      error: 'Debug failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
