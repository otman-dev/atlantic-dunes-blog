import { PostStats } from '../types';
import { posts } from '../data/posts';
import { categories } from '../data/categories';

export function getPostStats(): PostStats {
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(post => post.published).length;
  const draftPosts = totalPosts - publishedPosts;
  const categoryCounts = categories.map(category => ({
    category: category.name,
    count: posts.filter(post => post.category === category.name && post.published).length
  }));

  return {
    total: totalPosts,
    published: publishedPosts,
    drafts: draftPosts,
    categoryCounts
  };
}
