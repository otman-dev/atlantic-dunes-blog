import { Post, Category } from '../types';
import { readPosts, readCategories } from '../utils/fileSystem';

// Post retrieval functions
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await readPosts();
  return posts.find((post: Post) => post.slug === slug && post.published);
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const posts = await readPosts();
  return posts.find((post: Post) => post.id === id);
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const posts = await readPosts();
  const categories = await readCategories();
  const category = categories.find((cat: any) => cat.slug === categorySlug);
  if (!category) return [];
  return posts.filter((post: Post) => post.category === category.name && post.published);
}

export async function getAllPublishedPosts(): Promise<Post[]> {
  const posts = await readPosts();
  return posts.filter((post: Post) => post.published).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await readPosts();
  return posts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Category retrieval functions
export async function getAllCategories(): Promise<Category[]> {
  return await readCategories();
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await readCategories();
  return categories.find((cat: any) => cat.slug === slug);
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const categories = await readCategories();
  return categories.find((cat: any) => cat.id.toString() === id);
}

// Search and filter functions
export async function searchPosts(query: string): Promise<Post[]> {
  const posts = await readPosts();
  const lowercaseQuery = query.toLowerCase();
  
  return posts.filter((post: Post) => 
    post.published && (
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery)
    )
  );
}

export async function getRecentPosts(limit: number = 5): Promise<Post[]> {
  const posts = await getAllPublishedPosts();
  return posts.slice(0, limit);
}

export async function getRelatedPosts(currentPostId: string, limit: number = 3): Promise<Post[]> {
  const posts = await readPosts();
  const currentPost = posts.find((post: Post) => post.id === currentPostId);
  if (!currentPost) return [];
  
  const relatedPosts = posts.filter((post: Post) => 
    post.published && 
    post.id !== currentPostId && 
    post.category === currentPost.category
  );
  
  return relatedPosts.slice(0, limit);
}
