import slugify from 'slugify';
import { Post, Category } from '../types';
import { readPosts, writePosts, readCategories, writeCategories, createBackup } from '../utils/fileSystem';

// Post CRUD operations
export async function createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
  const posts = await readPosts();
  
  const newPost: Post = {
    ...postData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  posts.push(newPost);
  await writePosts(posts);
  return newPost;
}

export async function updatePost(id: string, updates: Partial<Omit<Post, 'id' | 'createdAt'>>): Promise<Post | null> {
  const posts = await readPosts();
  const postIndex = posts.findIndex((post: Post) => post.id === id);
  if (postIndex === -1) return null;
  
  posts[postIndex] = {
    ...posts[postIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  await writePosts(posts);
  return posts[postIndex];
}

export async function deletePost(id: string): Promise<boolean> {
  await createBackup(); // Create backup before deletion
  
  const posts = await readPosts();
  const postIndex = posts.findIndex((post: Post) => post.id === id);
  if (postIndex === -1) return false;
  
  posts.splice(postIndex, 1);
  await writePosts(posts);
  return true;
}

// Category CRUD operations
export async function createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
  const categories = await readCategories();
  
  const newCategory: Category = {
    ...categoryData,
    id: (Math.max(...categories.map((c: any) => c.id || 0), 0) + 1).toString(),
    slug: categoryData.slug || slugify(categoryData.name, { lower: true, strict: true })
  };
  
  categories.push(newCategory);
  await writeCategories(categories);
  return newCategory;
}

export async function updateCategory(id: string, updates: Partial<Omit<Category, 'id'>>): Promise<Category | null> {
  const categories = await readCategories();
  const categoryIndex = categories.findIndex((category: any) => category.id.toString() === id);
  if (categoryIndex === -1) return null;
  
  categories[categoryIndex] = {
    ...categories[categoryIndex],
    ...updates,
    slug: updates.slug || categories[categoryIndex].slug
  };
  
  await writeCategories(categories);
  return categories[categoryIndex];
}

export async function deleteCategory(id: string): Promise<boolean> {
  const categories = await readCategories();
  const posts = await readPosts();
  
  const categoryIndex = categories.findIndex((category: any) => category.id.toString() === id);
  if (categoryIndex === -1) return false;
  
  // Check if any posts use this category
  const categoryName = categories[categoryIndex].name;
  const postsUsingCategory = posts.some((post: Post) => {
    return post.category === categoryName;
  });
  
  if (postsUsingCategory) {
    throw new Error('Cannot delete category that is being used by posts');
  }
  
  await createBackup(); // Create backup before deletion
  categories.splice(categoryIndex, 1);
  await writeCategories(categories);
  return true;
}
