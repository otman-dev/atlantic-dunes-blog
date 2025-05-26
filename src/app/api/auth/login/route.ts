import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import bcrypt from 'bcryptjs';
import { sessionOptions, SessionData } from '@/lib/session';
import { readJsonFile } from '@/lib/utils/fileSystem';

interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: string;
  createdAt: string;
  lastLogin: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Read users from file
    const users = await readJsonFile<User[]>('users.json');
    const user = users.find(u => u.username === username);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }    // Create response first
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
    session.userId = user.id;
    session.username = user.username;
    session.role = user.role;
    session.isAuthenticated = true;
    await session.save();

    // Update last login (optional)
    user.lastLogin = new Date().toISOString();
    // You could save this back to the file if needed

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
