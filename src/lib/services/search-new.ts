import { Post, SearchOptions, PaginatedResult } from '../types';
import { getAllPosts } from './api';

export async function searchPosts(options: SearchOptions = {}): Promise<PaginatedResult<Post>> {
  const {
    query = '',
    category,
    limit = 10,
    offset = 0,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  const allPosts = await getAllPosts();
  let filteredPosts = allPosts.filter((post: Post) => post.published);

  // Search in title, excerpt, and content
  if (query) {
    const searchTerm = query.toLowerCase();
    filteredPosts = filteredPosts.filter((post: Post) =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by category
  if (category && category !== 'all') {
    filteredPosts = filteredPosts.filter((post: Post) => 
      post.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Sort posts
  filteredPosts.sort((a: Post, b: Post) => {
    let aValue: any = (a as any)[sortBy];
    let bValue: any = (b as any)[sortBy];

    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const total = filteredPosts.length;
  const totalPages = Math.ceil(total / limit);
  const page = Math.floor(offset / limit) + 1;
  const paginatedPosts = filteredPosts.slice(offset, offset + limit);

  return {
    data: paginatedPosts,
    total,
    page,
    limit,
    totalPages
  };
}

// Related posts function
export async function getRelatedPosts(postId: string, limit: number = 3): Promise<Post[]> {
  const allPosts = await getAllPosts();
  const currentPost = allPosts.find((post: Post) => post.id === postId);
  
  if (!currentPost) return [];

  const relatedPosts = allPosts.filter((post: Post) =>
    post.published &&
    post.id !== postId &&
    post.category === currentPost.category
  );

  return relatedPosts
    .sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

// Trending posts (most recent)
export async function getTrendingPosts(limit: number = 5): Promise<Post[]> {
  const allPosts = await getAllPosts();
  const publishedPosts = allPosts.filter((post: Post) => post.published);
  
  return publishedPosts
    .sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
