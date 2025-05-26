'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Post } from '@/lib/data';
import { getAllCategories } from '@/lib/services/api';
import MarkdownEditor from './MarkdownEditor';

interface PostFormProps {
  initialPost?: Partial<Post>;
  onSubmit: (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isEdit?: boolean;
}

export default function PostForm({ initialPost, onSubmit, isEdit = false }: PostFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);  const [formData, setFormData] = useState({
    title: initialPost?.title || '',
    slug: initialPost?.slug || '',
    content: initialPost?.content || '',
    excerpt: initialPost?.excerpt || '',
    category: initialPost?.category || '',
    author: initialPost?.author || '',
    published: initialPost?.published || false
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
        
        // Set default category if none selected and categories available
        if (!formData.category && categoriesData.length > 0) {
          setFormData(prev => ({
            ...prev,
            category: categoriesData[0].name
          }));
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback to hardcoded categories if API fails
        setCategories([
          { id: '1', name: 'Technology', slug: 'technology' },
          { id: '2', name: 'Travel', slug: 'travel' },
          { id: '3', name: 'Lifestyle', slug: 'lifestyle' },
          { id: '4', name: 'Food', slug: 'food' }
        ]);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  // Auto-generate excerpt from content
  const autoGenerateExcerpt = () => {
    if (formData.content) {
      const plainText = formData.content
        .replace(/[#*`>\[\]()]/g, '') // Remove markdown syntax
        .replace(/\n+/g, ' ') // Replace line breaks with spaces
        .trim();
      
      const excerpt = plainText.substring(0, 160) + (plainText.length > 160 ? '...' : '');
      setFormData(prev => ({ ...prev, excerpt }));
    }
  };
  return (
    <div className="max-w-7xl mx-auto">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isEdit ? 'Edit Post' : 'Create New Post'}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="Enter your post title..."
                required
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="url-slug"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                id="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Author name"
                required              />
            </div>

            <div className="flex items-center">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Status:</span>{' '}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  formData.published 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {formData.published ? (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Published
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Draft
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                Excerpt
              </label>
              <button
                type="button"
                onClick={autoGenerateExcerpt}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Auto-generate from content
              </button>
            </div>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Brief description of your post (optional, will be auto-generated if left empty)"
            />
            <p className="mt-1 text-sm text-gray-500">
              {formData.excerpt.length}/160 characters
            </p>
          </div>
        </div>

        {/* Content Editor Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Content</h3>
            <p className="text-sm text-gray-600 mt-1">
              Write your post using Markdown. Use the toolbar for formatting help.
            </p>
          </div>
          
          <MarkdownEditor
            value={formData.content}
            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
            placeholder="Start writing your amazing post here...

# This is a heading

You can use **bold text**, *italic text*, and `inline code`.

## Lists work too:

- Bullet points
- Another point
  - Nested points

1. Numbered lists
2. Second item

> Blockquotes for emphasis

[Links](https://example.com) and images work too!"
          />        </div>        {/* Action Buttons */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Auto-saves every few seconds
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
              {/* Save as Draft Button */}
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({ ...prev, published: false }));
                setTimeout(() => {
                  if (formRef.current) {
                    formRef.current.requestSubmit();
                  }
                }, 0);
              }}
              disabled={saving || !formData.title.trim() || !formData.content.trim()}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {saving && !formData.published ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Draft...
                </>
              ) : (
                <>
                  <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Save as Draft
                </>
              )}
            </button>
              {/* Publish Button */}
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({ ...prev, published: true }));
                setTimeout(() => {
                  if (formRef.current) {
                    formRef.current.requestSubmit();
                  }
                }, 0);
              }}
              disabled={saving || !formData.title.trim() || !formData.content.trim()}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {saving && formData.published ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {isEdit ? 'Update & Publish' : 'Publish Post'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
