'use client';

import { useState } from 'react';
import slugify from 'slugify';
import type { Category } from '@/lib/types';

interface CategoryFormProps {
  initialCategory?: Category;
  onSubmit: (categoryData: Omit<Category, 'id'>) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function CategoryForm({ initialCategory, onSubmit, onCancel, isEdit = false }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: initialCategory?.name || '',
    slug: initialCategory?.slug || '',
    description: initialCategory?.description || '',
  });

  const [autoSlug, setAutoSlug] = useState(!isEdit);

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: autoSlug ? slugify(name, { lower: true, strict: true }) : prev.slug
    }));
  };

  const handleSlugChange = (slug: string) => {
    setAutoSlug(false);
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    const finalSlug = formData.slug || slugify(formData.name, { lower: true, strict: true });
    
    onSubmit({
      name: formData.name.trim(),
      slug: finalSlug,
      description: formData.description.trim(),
    });
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {isEdit ? 'Edit Category' : 'Add New Category'}
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Category Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter category name"
            required
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
            URL Slug
          </label>
          <input
            type="text"
            id="slug"
            value={formData.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="category-url-slug"
          />
          <p className="mt-1 text-sm text-gray-600">
            Auto-generated from name. Used in URLs: /category/{formData.slug || 'category-slug'}
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief description of this category"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {isEdit ? 'Update Category' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  );
}
