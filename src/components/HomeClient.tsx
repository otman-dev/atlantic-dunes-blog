'use client';

import { useState, useEffect } from 'react';
import PostCard from '@/components/PostCard';
import CategoryFilter from '@/components/CategoryFilter';
import type { Post, Category } from '@/lib/types';

interface HomeClientProps {
  initialPosts: Post[];
  categories: Category[];
}

export default function HomeClient({ initialPosts, categories }: HomeClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      if (selectedCategory === 'all') {
        setPosts(initialPosts);
        return;
      }

      try {
        setLoading(true);
        // Filter posts by category on the client side
        const filteredPosts = initialPosts.filter(post => post.category === selectedCategory);
        setPosts(filteredPosts);
      } catch (error) {
        console.error('Error filtering posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadPosts();
  }, [selectedCategory, initialPosts]);

  return (
    <>      {/* Category Filter */}
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Posts Grid */}
      <div className="mt-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading posts...</p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No posts found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
