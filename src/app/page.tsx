import HomeClient from '@/components/HomeClient';
import { getAllPublishedPosts, getAllCategories } from '@/lib/services/queries';

export default async function Home() {
  // Fetch data on the server
  const [posts, categories] = await Promise.all([
    getAllPublishedPosts(),
    getAllCategories()
  ]);

  return <HomeClient initialPosts={posts} categories={categories} />;
}
