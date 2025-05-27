import { NextResponse } from 'next/server';
import { getUsersCollection, initializeDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    await initializeDatabase();
    const usersCollection = await getUsersCollection();
    
    const users = await usersCollection.find({}).toArray();
    const userCount = await usersCollection.countDocuments();
    
    // Don't expose password hashes in debug
    const safeUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }));
    
    return NextResponse.json({
      success: true,
      count: userCount,
      users: safeUsers
    });
  } catch (error) {
    console.error('Debug users error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      },
      { status: 500 }
    );
  }
}
