import { Post, Category } from '../types';
import { getPostsCollection, getCategoriesCollection, initializeDatabase } from '../mongodb';

// Post mutations
export async function createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
  await initializeDatabase();
  const postsCollection = await getPostsCollection();
  
  const postId = Date.now().toString();
  const newPost: Post = {
    ...postData,
    id: postId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await postsCollection.insertOne(newPost);
  return { ...newPost, _id: undefined } as Post;
}

export async function updatePost(id: string, postData: Partial<Post>): Promise<Post | null> {
  await initializeDatabase();
  const postsCollection = await getPostsCollection();
  
  const updateData = {
    ...postData,
    updatedAt: new Date()
  };
  
  const result = await postsCollection.updateOne(
    { id },
    { $set: updateData }
  );
  
  if (result.matchedCount === 0) {
    return null;
  }
  
  const updatedPost = await postsCollection.findOne({ id });
  return updatedPost ? { ...updatedPost, _id: undefined } as Post : null;
}

export async function deletePost(id: string): Promise<boolean> {
  await initializeDatabase();
  const postsCollection = await getPostsCollection();
  
  const result = await postsCollection.deleteOne({ id });
  return result.deletedCount > 0;
}

// Category mutations
export async function createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
  await initializeDatabase();
  const categoriesCollection = await getCategoriesCollection();
  
  const categoryId = Date.now().toString();
  const newCategory: Category = {
    ...categoryData,
    id: categoryId
  };
  
  await categoriesCollection.insertOne(newCategory);
  return { ...newCategory, _id: undefined } as Category;
}

export async function updateCategory(id: string, categoryData: Partial<Category>): Promise<Category | null> {
  await initializeDatabase();
  const categoriesCollection = await getCategoriesCollection();
  
  const result = await categoriesCollection.updateOne(
    { id },
    { $set: categoryData }
  );
  
  if (result.matchedCount === 0) {
    return null;
  }
  
  const updatedCategory = await categoriesCollection.findOne({ id });
  return updatedCategory ? { ...updatedCategory, _id: undefined } as Category : null;
}

export async function deleteCategory(id: string): Promise<boolean> {
  await initializeDatabase();
  const categoriesCollection = await getCategoriesCollection();
  const postsCollection = await getPostsCollection();
  
  // Check if any posts use this category
  const category = await categoriesCollection.findOne({ id });
  if (category) {
    const postsWithCategory = await postsCollection.countDocuments({ category: category.name });
    if (postsWithCategory > 0) {
      throw new Error('Cannot delete category that is being used by posts');
    }
  }
  
  const result = await categoriesCollection.deleteOne({ id });
  return result.deletedCount > 0;
}
