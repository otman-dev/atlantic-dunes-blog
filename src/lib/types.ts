// Types for the blog data models

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface SearchOptions {
  query?: string;
  category?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PostStats {
  total: number;
  published: number;
  drafts: number;
  categoryCounts: Array<{
    category: string;
    count: number;
  }>;
}
