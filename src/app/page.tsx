'use client';

import { useState, useEffect } from 'react';
import PostCard from '@/components/PostCard';
import CategoryFilter from '@/components/CategoryFilter';
import { getAllPosts } from '@/lib/services/api';
import { Post } from '@/lib/types';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllPosts() {
      setLoading(true);
      try {
        const postsData = await getAllPosts();
        // Filter only published posts
        const publishedPosts = postsData.filter(post => post.published);
        setAllPosts(publishedPosts);
        setPosts(publishedPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
        setAllPosts([]);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadAllPosts();
  }, []);
  useEffect(() => {
    if (selectedCategory === 'all') {
      setPosts(allPosts);
    } else {
      const filteredPosts = allPosts.filter(post => 
        post.category === selectedCategory
      );
      setPosts(filteredPosts);
    }
  }, [selectedCategory, allPosts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to
          <span className="block text-blue-600">Atlantic Dunes</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover insights on technology, travel adventures, lifestyle tips, and culinary experiences. 
          Join us on a journey through the digital dunes of modern life.
        </p>
      </div>

      {/* Category Filter */}
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />      {/* Posts Grid */}
      {loading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-500">No posts available in this category yet.</p>
        </div>
      )}
    </div>
  );
}
