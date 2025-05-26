import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json({ isAuthenticated: false });
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    console.log('Session check - session data:', {
      isAuthenticated: session.isAuthenticated,
      userId: session.userId,
      username: session.username
    });

    if (!session.isAuthenticated) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: session.userId,
        username: session.username,
        role: session.role
      }
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }
}
