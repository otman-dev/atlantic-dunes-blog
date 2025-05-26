import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import bcrypt from 'bcryptjs';
import { sessionOptions, SessionData } from '@/lib/session';
import { readJsonFile } from '@/lib/utils/fileSystem';
import { checkEnvironment } from '@/lib/utils/environment';

interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: string;
  createdAt: string;
  lastLogin: string | null;
}

// Fallback users for Vercel deployment (when file system access fails)
const FALLBACK_USERS: User[] = [
  {
    id: "1",
    username: "admin",
    passwordHash: "$2b$10$bfVH/uqWSbNm3qZjV9A7MecSgo4DZsa50lPzAdXf8anoIdINfQ.fq", // admin123
    role: "admin",
    createdAt: "2025-05-26T19:20:08.634Z",
    lastLogin: null
  }
];

async function getUsers(): Promise<User[]> {
  try {
    console.log('Attempting to read users from file system...');
    const users = await readJsonFile<User[]>('users.json');
    console.log('Successfully read users from file:', users.length, 'users found');
    return users;
  } catch (error) {
    console.log('File system read failed, using fallback users:', error);
    console.log('Using fallback users for authentication');
    return FALLBACK_USERS;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Login request received');
    console.log('Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      isVercel: !!process.env.VERCEL_URL
    });
    
    // Check environment configuration
    const envChecks = checkEnvironment();
    
    if (!envChecks.hasSessionSecret) {
      console.error('SESSION_SECRET not configured!');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    console.log('Attempting login for username:', username);

    // Get users (with fallback for Vercel)
    const users = await getUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
      console.log('User not found:', username);
      console.log('Available users:', users.map(u => u.username));
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    console.log('User found, verifying password...');
    console.log('User data:', { id: user.id, username: user.username, role: user.role });

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      console.log('Invalid password for user:', username);
      console.log('Password hash:', user.passwordHash);
      // Test if the password is plain text (for debugging)
      const isPlainTextMatch = password === user.passwordHash;
      console.log('Plain text match test:', isPlainTextMatch);
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    console.log('Password verified for user:', username);

    // Create response first
    const response = NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      } 
    });

    // Create session with the response
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    
    console.log('Session before setting data:', session);
    console.log('Session options:', {
      cookieName: sessionOptions.cookieName,
      secure: sessionOptions.cookieOptions?.secure,
      httpOnly: sessionOptions.cookieOptions?.httpOnly,
      sameSite: sessionOptions.cookieOptions?.sameSite,
      domain: sessionOptions.cookieOptions?.domain
    });
    
    session.userId = user.id;
    session.username = user.username;
    session.role = user.role;
    session.isAuthenticated = true;
    
    console.log('Session data set:', {
      userId: session.userId,
      username: session.username,
      role: session.role,
      isAuthenticated: session.isAuthenticated
    });
    
    await session.save();
    console.log('Session saved successfully');

    // Update last login (optional)
    user.lastLogin = new Date().toISOString();
    // You could save this back to the file if needed

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
