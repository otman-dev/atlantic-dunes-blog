import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionData } from '@/lib/services/session';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    
    return NextResponse.json({
      isAuthenticated: session.isAuthenticated || false,
      userId: session.userId || null,
      username: session.username || null,
      role: session.role || null,
      sessionExists: true
    });
  } catch (error) {
    console.error('Debug session error:', error);
    return NextResponse.json({
      error: 'Failed to get session',
      sessionExists: false
    }, { status: 500 });
  }
}
