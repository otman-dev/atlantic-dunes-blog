import fs from 'fs/promises';
import path from 'path';
import { Post } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

// Ensure data directory exists
export async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Generic file operations
export async function readJsonFile<T>(filename: string): Promise<T> {
  try {
    await ensureDataDirectory();
    const filePath = path.join(DATA_DIR, filename);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw new Error(`Failed to read ${filename}`);
  }
}

export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  try {
    await ensureDataDirectory();
    const filePath = path.join(DATA_DIR, filename);
    const jsonContent = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonContent, 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw new Error(`Failed to write ${filename}`);
  }
}

// Posts file operations
export async function readPosts(): Promise<Post[]> {
  return readJsonFile<Post[]>('posts.json');
}

export async function writePosts(posts: Post[]): Promise<void> {
  return writeJsonFile('posts.json', posts);
}

// Categories file operations
export async function readCategories(): Promise<any[]> {
  return readJsonFile<any[]>('categories.json');
}

export async function writeCategories(categories: any[]): Promise<void> {
  return writeJsonFile('categories.json', categories);
}

// Create backup before major operations
export async function createBackup(): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(DATA_DIR, 'backups');
  
  try {
    await fs.mkdir(backupDir, { recursive: true });
    
    const posts = await readPosts();
    const categories = await readCategories();
    
    const backupData = {
      posts,
      categories,
      timestamp: new Date().toISOString()
    };
    
    const backupFilename = `backup-${timestamp}.json`;
    const backupPath = path.join(backupDir, backupFilename);
    
    await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2));
    return backupFilename;
  } catch (error) {
    console.error('Error creating backup:', error);
    throw new Error('Failed to create backup');
  }
}

// Server-side post retrieval functions (for server components)
export async function getPublishedPostsServer(): Promise<Post[]> {
  try {
    const posts = await readPosts();
    return posts
      .filter(post => post.published)
      .map(post => ({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt)
      }));
  } catch (error) {
    console.error('Error getting published posts:', error);
    return [];
  }
}

export async function getPostBySlugServer(slug: string): Promise<Post | null> {
  try {
    const posts = await readPosts();
    const post = posts.find(p => p.slug === slug && p.published);
    if (!post) return null;
    
    return {
      ...post,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt)
    };
  } catch (error) {
    console.error('Error getting post by slug:', error);
    return null;
  }
}

export async function getPostByIdServer(id: string): Promise<Post | null> {
  try {
    const posts = await readPosts();
    const post = posts.find(p => p.id === id);
    if (!post) return null;
    
    return {
      ...post,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt)
    };
  } catch (error) {
    console.error('Error getting post by id:', error);
    return null;
  }
}
