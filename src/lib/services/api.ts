import { Post, Category } from '@/lib/types';

// Client-side API service functions
export async function getAllPosts(): Promise<Post[]> {
  try {
    const response = await fetch('/api/posts');
    if (!response.ok) throw new Error('Failed to fetch posts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const response = await fetch(`/api/posts/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch post');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  
  return await response.json();
}

export async function updatePost(id: string, updates: Partial<Omit<Post, 'id' | 'createdAt'>>): Promise<Post> {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update post');
  }
  
  return await response.json();
}

export async function deletePost(id: string): Promise<boolean> {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete post');
  }
  
  return true;
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await fetch('/api/categories');
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const response = await fetch(`/api/categories/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch category');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categoryData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create category');
  }
  
  return await response.json();
}

export async function updateCategory(id: string, updates: Partial<Omit<Category, 'id'>>): Promise<Category> {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update category');
  }
  
  return await response.json();
}

export async function deleteCategory(id: string): Promise<boolean> {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete category');
  }
  
  return true;
}

// Utility functions
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter(post => post.published);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find(post => post.slug === slug && post.published) || null;
}

export async function searchPosts(query: string): Promise<Post[]> {
  const posts = await getPublishedPosts();
  const lowercaseQuery = query.toLowerCase();
  
  return posts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery)
  );
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.filter(post => post.category === category);
}

export async function getRecentPosts(limit: number = 5): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
