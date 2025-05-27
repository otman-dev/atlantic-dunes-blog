import { MongoClient, Db, Collection } from 'mongodb';
import { Post, Category } from './types';

interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: string;
  createdAt: string;
  lastLogin: string | null;
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://rasmus:wordpiss@adro.ddns.net:27017';
const DB_NAME = 'atlantic_dunes_blog';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<{ db: Db; client: MongoClient }> {
  if (!client) {
    try {
      console.log('Connecting to MongoDB at:', MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@'));
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  if (!db) {
    db = client.db(DB_NAME);
  }

  return { db, client };
}

export async function getPostsCollection(): Promise<Collection<Post>> {
  const { db } = await connectToDatabase();
  return db.collection<Post>('posts');
}

export async function getCategoriesCollection(): Promise<Collection<Category>> {
  const { db } = await connectToDatabase();
  return db.collection<Category>('categories');
}

export async function getUsersCollection(): Promise<Collection<User>> {
  const { db } = await connectToDatabase();
  return db.collection<User>('users');
}

const samplePosts: Omit<Post, '_id'>[] = [
  {
    id: "1",
    title: "Welcome to Atlantic Dunes Blog",
    slug: "welcome-to-atlantic-dunes-blog",
    excerpt: "Discover the beauty and mystery of coastal landscapes through our blog.",
    content: "# Welcome to Atlantic Dunes Blog\n\nWelcome to our blog about the stunning Atlantic coastal regions...",
    author: "Admin",
    category: "General",
    published: true,
    createdAt: new Date("2025-05-26T19:20:08.634Z"),
    updatedAt: new Date("2025-05-26T19:20:08.634Z")
  },
  {
    id: "2",
    title: "Exploring Coastal Ecosystems",
    slug: "exploring-coastal-ecosystems",
    excerpt: "A deep dive into the unique ecosystems found along the Atlantic coast.",
    content: "# Exploring Coastal Ecosystems\n\nThe Atlantic coast hosts some of the most diverse ecosystems...",
    author: "Marine Biologist",
    category: "Nature",
    published: true,
    createdAt: new Date("2025-05-25T10:30:00.000Z"),
    updatedAt: new Date("2025-05-25T10:30:00.000Z")
  }
];

const sampleCategories: Omit<Category, '_id'>[] = [
  {
    id: "1",
    name: "General",
    slug: "general",
    description: "General posts and updates"
  },
  {
    id: "2",
    name: "Nature",
    slug: "nature",
    description: "Posts about nature and wildlife"
  },
  {
    id: "3",
    name: "Travel",
    slug: "travel",
    description: "Travel guides and experiences"
  }
];

const sampleUsers: Omit<User, '_id'>[] = [
  {
    id: "1",
    username: "admin",
    passwordHash: "$2b$10$bfVH/uqWSbNm3qZjV9A7MecSgo4DZsa50lPzAdXf8anoIdINfQ.fq", // admin123
    role: "admin",
    createdAt: "2025-05-26T19:20:08.634Z",
    lastLogin: null
  }
];

let isInitialized = false;

export async function initializeDatabase(): Promise<void> {
  if (isInitialized) {
    return;
  }

  try {
    const { db } = await connectToDatabase();
    
    console.log('Initializing database with sample data...');
    
    // Initialize posts
    const postsCollection = db.collection<Post>('posts');
    const postsCount = await postsCollection.countDocuments();
    if (postsCount === 0) {
      console.log('Inserting sample posts...');
      await postsCollection.insertMany(samplePosts);
      console.log('Sample posts inserted');
    }
    
    // Initialize categories
    const categoriesCollection = db.collection<Category>('categories');
    const categoriesCount = await categoriesCollection.countDocuments();
    if (categoriesCount === 0) {
      console.log('Inserting sample categories...');
      await categoriesCollection.insertMany(sampleCategories);
      console.log('Sample categories inserted');
    }
    
    // Initialize users
    const usersCollection = db.collection<User>('users');
    const usersCount = await usersCollection.countDocuments();
    if (usersCount === 0) {
      console.log('Inserting sample users...');
      await usersCollection.insertMany(sampleUsers);
      console.log('Sample users inserted');
    }
    
    isInitialized = true;
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
