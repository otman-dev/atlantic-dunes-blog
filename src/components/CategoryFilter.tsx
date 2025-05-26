'use client';

import { useState, useEffect } from 'react';
import { getAllCategories } from '@/lib/services/api';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback categories
        setCategories([
          { id: '1', name: 'Technology', slug: 'technology' },
          { id: '2', name: 'Travel', slug: 'travel' },
          { id: '3', name: 'Lifestyle', slug: 'lifestyle' },
          { id: '4', name: 'Food', slug: 'food' }
        ]);
      }
    }
    
    loadCategories();
  }, []);
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Posts
        </button>        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
