import { SessionOptions } from 'iron-session';

export interface SessionData {
  userId?: string;
  username?: string;
  role?: string;
  isAuthenticated: boolean;
}

export const defaultSession: SessionData = {
  isAuthenticated: false,
};

// Get the session secret with fallback
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    console.warn('SESSION_SECRET not found, using fallback (not recommended for production)');
    return 'fallback_session_secret_at_least_32_characters_long_for_security_purposes';
  }
  return secret;
}

// Enhanced session options for better Vercel compatibility
export const sessionOptions: SessionOptions = {
  password: getSessionSecret(),
  cookieName: 'atlantic-dunes-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production' || !!process.env.VERCEL_URL, // Always secure on Vercel
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/', // Ensure cookie is available across the site
    domain: undefined, // Let the browser determine the domain
  },
  ttl: 60 * 60 * 24 * 7, // 1 week (session TTL)
};

// Helper function to get session with better error handling
export async function getSession(request: any, response: any) {
  try {
    const { getIronSession } = await import('iron-session');
    return await getIronSession<SessionData>(request, response, sessionOptions);
  } catch (error) {
    console.error('Failed to get session:', error);
    return defaultSession;
  }
}
