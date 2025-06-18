'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategoryTree } from '@/lib/api';
import { Category } from '@/lib/types';

interface CategoryNodeProps {
  category: Category;
  level?: number;
}

const CategoryNode: React.FC<CategoryNodeProps> = ({ category, level = 0 }) => {
  return (
    <div style={{ marginLeft: `${level * 20}px` }} className="py-1">
      <Link href={`/categories/${category.category_slug}`} className="text-blue-600 hover:underline">
        {category.category_name}
      </Link>
      {category.children && category.children.length > 0 && (
        <div>
          {category.children.map((child) => (
            <CategoryNode key={child.category_id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CategoryTree() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeOnly, setActiveOnly] = useState(true);

  useEffect(() => {
    const fetchCategoryTree = async () => {
      try {
        setLoading(true);
        const response = await getCategoryTree(activeOnly);
        setCategories(response.data.categories);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load category tree');
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryTree();
  }, [activeOnly]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Category Tree</h2>
      <div className="mb-4">
        <label className="mr-2">Show active only</label>
        <input
          type="checkbox"
          checked={activeOnly}
          onChange={(e) => setActiveOnly(e.target.checked)}
          className="h-4 w-4 text-blue-600"
        />
      </div>
      <div>
        {categories.map((category) => (
          <CategoryNode key={category.category_id} category={category} />
        ))}
      </div>
    </div>
  );
}