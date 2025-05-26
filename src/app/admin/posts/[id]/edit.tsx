'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import PostForm from '@/components/PostForm';
import { getPostById, updatePost } from '@/lib/services/api';
import type { Post } from '@/lib/types';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await getPostById(params.id);
        if (!postData) {
          notFound();
          return;
        }
        setPost(postData);
      } catch (error) {
        console.error('Error loading post:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params.id]);

  const handleSubmit = async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await updatePost(params.id, postData);
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post. Please try again.');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
          <p className="text-gray-600">Update your blog post</p>
        </div>

        <PostForm 
          initialPost={post} 
          onSubmit={handleSubmit} 
          isEdit={true}
        />
      </div>
    </ProtectedRoute>
  );
}
