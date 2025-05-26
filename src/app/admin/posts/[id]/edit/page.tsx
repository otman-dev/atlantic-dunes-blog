'use client';

import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PostForm from '@/components/PostForm';
import type { Post } from '@/lib/types';

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);  useEffect(() => {
    async function loadPost() {
      try {
        const { id } = await params;
        const response = await fetch(`/api/posts/${id}`);
        if (response.ok) {
          const foundPost = await response.json();
          setPost(foundPost);
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error('Error loading post:', error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [params]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading post...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!post) {
    notFound();
  }  const handleSubmit = async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { id } = await params;
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post. Please try again.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
            <p className="text-gray-600">Update your blog post: "{post.title}"</p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={`/posts/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Preview Post
            </a>
            <a
              href="/admin/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700"
            >
              Back to Dashboard
            </a>
          </div>
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
