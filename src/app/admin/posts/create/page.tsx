'use client';

import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import PostForm from '@/components/PostForm';
import { createPost } from '@/lib/services/api';
import type { Post } from '@/lib/types';

export default function CreatePostPage() {
  const router = useRouter();
  const handleSubmit = async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createPost(postData);
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-gray-600">Write and publish a new blog post</p>
        </div>

        <PostForm onSubmit={handleSubmit} />
      </div>
    </ProtectedRoute>
  );
}
