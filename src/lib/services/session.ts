// Session helpers for server components and API routes only.
// Do not import this file in client components or legacy /pages directory.

import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export interface SessionData {
  userId?: string;
  username?: string;
  role?: string;
  isAuthenticated: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_super_secret',
  cookieName: 'atlantic-dunes-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
};

// Helper function to check admin authentication in API routes
export async function requireAdminAuth(): Promise<SessionData | NextResponse> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  
  if (!session.isAuthenticated || !session.userId || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return session;
}

// Usage: import { cookies } from 'next/headers' in your API route or server component, then:
// const session = await getIronSession<SessionData>(cookies(), sessionOptions);
