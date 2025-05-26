import { Post, Category, SearchOptions, PaginatedResult } from '../types';
import { getAllPosts, getAllCategories } from './api';

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
    filteredPosts = filteredPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by category
  if (category && category !== 'all') {
    const categories = await getAllCategories();
    const categoryObj = categories.find((cat: Category) => cat.slug === category);
    if (categoryObj) {
      filteredPosts = filteredPosts.filter(post => post.category === categoryObj.name);
    }
  }

  // Sort posts
  filteredPosts.sort((a, b) => {
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];

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
