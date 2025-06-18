'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/api';
import { Category, CategoryResponse } from '@/lib/types';

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<CategoryResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    active_only: true,
    include_count: true,
    parent_only: false,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories(filters);
        setCategories(response.data.categories);
        setPagination(response.data.pagination);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [filters]);

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="mb-4 flex justify-between">
        <div>
          <label className="mr-2">Show active only</label>
          <input
            type="checkbox"
            checked={filters.active_only}
            onChange={(e) => setFilters({ ...filters, active_only: e.target.checked })}
            className="h-4 w-4 text-blue-600"
          />
        </div>
        <div>
          <label className="mr-2">Show parent only</label>
          <input
            type="checkbox"
            checked={filters.parent_only}
            onChange={(e) => setFilters({ ...filters, parent_only: e.target.checked })}
            className="h-4 w-4 text-blue-600"
          />
        </div>
        <div>
          <label className="mr-2">Include post count</label>
          <input
            type="checkbox"
            checked={filters.include_count}
            onChange={(e) => setFilters({ ...filters, include_count: e.target.checked })}
            className="h-4 w-4 text-blue-600"
          />
        </div>
      </div>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.category_id} className="p-3 bg-gray-50 rounded-md">
            <Link href={`/categories/${category.category_slug}`} className="text-blue-600 hover:underline">
              {category.category_name}
            </Link>
            {filters.include_count && (
              <span className="ml-2 text-sm text-gray-600">({category.post_count || 0} posts)</span>
            )}
            {category.description && <p className="text-sm text-gray-600">{category.description}</p>}
          </li>
        ))}
      </ul>
      {pagination && (
        <div className="mt-4 flex justify-center space-x-2">
          {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                page === pagination.current_page ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}