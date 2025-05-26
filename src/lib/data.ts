// Main data access layer - exports all functions and data
// This serves as the main entry point for the data layer

// Re-export types
export * from './types';

// Client-side API functions (for components)
export * from './services/api';

// Re-export static data for fallback
export { posts } from './data/posts';
export { categories } from './data/categories';
