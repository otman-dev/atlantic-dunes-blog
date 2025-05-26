import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    console.log('Logout request received');
    const response = NextResponse.json({ success: true });
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    
    console.log('Session before destroy:', {
      isAuthenticated: session.isAuthenticated,
      userId: session.userId,
      username: session.username
    });
    
    session.destroy();
    console.log('Session destroyed');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
