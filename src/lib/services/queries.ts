import { Post, Category } from '../types';
import { getPostsCollection, getCategoriesCollection, initializeDatabase } from '../mongodb';

// Post retrieval functions
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  await initializeDatabase();
  const postsCollection = await getPostsCollection();
  const post = await postsCollection.findOne({ slug, published: true });
  return post ? { ...post, _id: undefined } as Post : undefined;
}

export async function getPostById(id: string): Promise<Post | undefined> {
  await initializeDatabase();
  const postsCollection = await getPostsCollection();
  const post = await postsCollection.findOne({ id });
  return post ? { ...post, _id: undefined } as Post : undefined;
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  await initializeDatabase();
  const postsCollection = await getPostsCollection();
  const categoriesCollection = await getCategoriesCollection();
  
  const category = await categoriesCollection.findOne({ slug: categorySlug });
  if (!category) return [];
  
  const posts = await postsCollection.find({ category: category.name, published: true }).toArray();
  return posts.map((post: any) => ({ ...post, _id: undefined } as Post));
}

export async function getAllPublishedPosts(): Promise<Post[]> {
  await initializeDatabase();
  const postsCollection = await getPostsCollection();
  
  const posts = await postsCollection.find({ published: true }).sort({ createdAt: -1 }).toArray();
  return posts.map((post: any) => ({ ...post, _id: undefined } as Post));
}

export async function getAllPosts(): Promise<Post[]> {
  await initializeDatabase();
  const postsCollection = await getPostsCollection();
  
  const posts = await postsCollection.find({}).sort({ createdAt: -1 }).toArray();
  return posts.map((post: any) => ({ ...post, _id: undefined } as Post));
}

// Category retrieval functions
export async function getAllCategories(): Promise<Category[]> {
  await initializeDatabase();
  const categoriesCollection = await getCategoriesCollection();
  
  const categories = await categoriesCollection.find({}).toArray();
  return categories.map((category: any) => ({ ...category, _id: undefined } as Category));
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  await initializeDatabase();
  const categoriesCollection = await getCategoriesCollection();
  const category = await categoriesCollection.findOne({ slug });
  return category ? { ...category, _id: undefined } as Category : undefined;
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  await initializeDatabase();
  const categoriesCollection = await getCategoriesCollection();
  const category = await categoriesCollection.findOne({ id });
  return category ? { ...category, _id: undefined } as Category : undefined;
}

// Search and filter functions
export async function searchPosts(query: string): Promise<Post[]> {
  await initializeDatabase();
  const postsCollection = await getPostsCollection();
  const lowercaseQuery = query.toLowerCase();
  
  const posts = await postsCollection.find({
    published: true,
    $or: [
      { title: { $regex: lowercaseQuery, $options: 'i' } },
      { excerpt: { $regex: lowercaseQuery, $options: 'i' } },
      { content: { $regex: lowercaseQuery, $options: 'i' } }
    ]
  }).toArray();
  
  return posts.map((post: any) => ({ ...post, _id: undefined } as Post));
}

export async function getRecentPosts(limit: number = 5): Promise<Post[]> {
  const posts = await getAllPublishedPosts();
  return posts.slice(0, limit);
}

export async function getRelatedPosts(currentPostId: string, limit: number = 3): Promise<Post[]> {
  await initializeDatabase();
  const postsCollection = await getPostsCollection();
  
  const currentPost = await postsCollection.findOne({ id: currentPostId });
  if (!currentPost) return [];
  
  const relatedPosts = await postsCollection.find({
    published: true,
    id: { $ne: currentPostId },
    category: currentPost.category
  }).sort({ createdAt: -1 }).limit(limit).toArray();
  
  return relatedPosts.map((post: any) => ({ ...post, _id: undefined } as Post));
}
