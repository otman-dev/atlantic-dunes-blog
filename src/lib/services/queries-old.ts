import { Post, Category } from '../types';
import { posts } from '../data/posts';
import { categories } from '../data/categories';

// Post retrieval functions
export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(post => post.slug === slug && post.published);
}

export function getPostById(id: string): Post | undefined {
  return posts.find(post => post.id === id);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  const category = categories.find(cat => cat.slug === categorySlug);
  if (!category) return [];
  return posts.filter(post => post.category === category.name && post.published);
}

export function getAllPublishedPosts(): Post[] {
  return posts.filter(post => post.published).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getAllPosts(): Post[] {
  return posts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getRelatedPosts(postId: string, limit: number = 3): Post[] {
  const currentPost = getPostById(postId);
  if (!currentPost) return [];

  return posts
    .filter(post => 
      post.published && 
      post.id !== postId && 
      post.category === currentPost.category
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

// Category retrieval functions
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(category => category.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(category => category.id === id);
}

export function getAllCategories(): Category[] {
  return categories;
}
