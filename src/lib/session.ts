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

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_for_security',
  cookieName: 'atlantic-dunes-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production', // Always secure in production (Vercel uses HTTPS)
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/', // Ensure cookie is available across the site
    domain: undefined, // Let the browser determine the domain
  },
  ttl: 60 * 60 * 24 * 7, // 1 week (session TTL)
};
