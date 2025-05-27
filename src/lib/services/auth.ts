import bcrypt from 'bcryptjs';
import { getUsersCollection, initializeDatabase } from '../mongodb';

interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: string;
  createdAt: string;
  lastLogin: string | null;
}

interface AuthResult {
  success: boolean;
  user?: Omit<User, 'passwordHash'>;
  error?: string;
}

export async function authenticateUser(username: string, password: string): Promise<AuthResult> {
  try {
    await initializeDatabase();
    const usersCollection = await getUsersCollection();
    
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Update last login
    await usersCollection.updateOne(
      { id: user.id },
      { $set: { lastLogin: new Date().toISOString() } }
    );
    
    const { passwordHash, ...userWithoutPassword } = user;
    return { 
      success: true, 
      user: { ...userWithoutPassword, _id: undefined } as Omit<User, 'passwordHash'>
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export async function getUserById(id: string): Promise<Omit<User, 'passwordHash'> | null> {
  try {
    await initializeDatabase();
    const usersCollection = await getUsersCollection();
    
    const user = await usersCollection.findOne({ id });
    if (!user) {
      return null;
    }
    
    const { passwordHash, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, _id: undefined } as Omit<User, 'passwordHash'>;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function getUserByUsername(username: string): Promise<Omit<User, 'passwordHash'> | null> {
  try {
    await initializeDatabase();
    const usersCollection = await getUsersCollection();
    
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return null;
    }
    
    const { passwordHash, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, _id: undefined } as Omit<User, 'passwordHash'>;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function createUser(userData: {
  username: string;
  password: string;
  role?: string;
}): Promise<AuthResult> {
  try {
    await initializeDatabase();
    const usersCollection = await getUsersCollection();
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username: userData.username });
    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }
    
    const passwordHash = await bcrypt.hash(userData.password, 10);
    const userId = Date.now().toString();
    
    const newUser: User = {
      id: userId,
      username: userData.username,
      passwordHash,
      role: userData.role || 'user',
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    
    await usersCollection.insertOne(newUser);
    
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return { 
      success: true, 
      user: { ...userWithoutPassword, _id: undefined } as Omit<User, 'passwordHash'>
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
  try {
    await initializeDatabase();
    const usersCollection = await getUsersCollection();
    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const result = await usersCollection.updateOne(
      { id: userId },
      { $set: { passwordHash } }
    );
    
    return result.matchedCount > 0;
  } catch (error) {
    console.error('Error updating password:', error);
    return false;
  }
}
