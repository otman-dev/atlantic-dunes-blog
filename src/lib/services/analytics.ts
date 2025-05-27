import { PostStats } from '../types';
import { getPostsCollection, getCategoriesCollection, initializeDatabase } from '../mongodb';

export async function getPostStats(): Promise<PostStats> {
  await initializeDatabase();
  const [postsCollection, categoriesCollection] = await Promise.all([
    getPostsCollection(),
    getCategoriesCollection()
  ]);
  
  const totalPosts = await postsCollection.countDocuments({});
  const publishedPosts = await postsCollection.countDocuments({ published: true });
  const draftPosts = totalPosts - publishedPosts;
  
  const categories = await categoriesCollection.find({}).toArray();
  const categoryCounts = await Promise.all(
    categories.map(async (category: any) => ({
      category: category.name,
      count: await postsCollection.countDocuments({ 
        category: category.name, 
        published: true 
      })
    }))
  );

  return {
    total: totalPosts,
    published: publishedPosts,
    drafts: draftPosts,
    categoryCounts
  };
}

export async function getDashboardAnalytics(): Promise<any> {
  // For now, return post stats as analytics
  // Can be extended to include more detailed analytics from MongoDB
  return await getPostStats();
}

export async function updateAnalytics(data: any): Promise<void> {
  // For now, this is a placeholder
  // Can be implemented to store analytics data in MongoDB if needed
  console.log('Analytics data:', data);
}
