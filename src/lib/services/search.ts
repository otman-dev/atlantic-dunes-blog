import { Post, SearchOptions, PaginatedResult } from '../types';
import { getPostsCollection, initializeDatabase } from '../mongodb';
import { getCategoryBySlug } from './queries';

export async function searchPostsPaginated(options: SearchOptions = {}): Promise<PaginatedResult<Post>> {
  const {
    query = '',
    category,
    limit = 10,
    offset = 0,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  await initializeDatabase();
  const postsCollection = await getPostsCollection();
  
  // Build MongoDB query
  const mongoQuery: any = { published: true };
  
  // Add search conditions
  if (query) {
    mongoQuery.$or = [
      { title: { $regex: query, $options: 'i' } },
      { excerpt: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } }
    ];
  }
  
  // Filter by category
  if (category && category !== 'all') {
    const categoryObj = await getCategoryBySlug(category);
    if (categoryObj) {
      mongoQuery.category = categoryObj.name;
    }
  }
  
  // Build sort option
  const sortOption: any = {};
  sortOption[sortBy] = sortOrder === 'asc' ? 1 : -1;
  
  // Get total count
  const total = await postsCollection.countDocuments(mongoQuery);
  
  // Get paginated results
  const posts = await postsCollection
    .find(mongoQuery)
    .sort(sortOption)
    .skip(offset)
    .limit(limit)
    .toArray();
  
  const totalPages = Math.ceil(total / limit);
  const page = Math.floor(offset / limit) + 1;
  
  return {
    data: posts.map((post: any) => ({ ...post, _id: undefined } as Post)),
    total,
    page,
    limit,
    totalPages
  };
}
