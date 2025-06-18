'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, getCategoryPosts } from '@/lib/api';
import { Category, CategoryPostsResponse } from '@/lib/types';

export default function CategoryPosts() {
  const { slug } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [postsResponse, setPostsResponse] = useState<CategoryPostsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort: 'published_at',
    order: 'DESC',
    language: 'en',
  });

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const [categoryRes, postsRes] = await Promise.all([
          getCategoryBySlug(slug as string),
          getCategoryPosts(slug as string, filters),
        ]);
        setCategory(categoryRes.data.category);
        setPostsResponse(postsRes.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load category or posts');
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchCategoryData();
    }
  }, [slug, filters]);

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;
  if (!category || !postsResponse) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{category.category_name}</h2>
      {category.description && <p className="text-gray-600 mb-4">{category.description}</p>}
      {category.parentCategory && (
        <p className="mb-4">
          Parent: <Link href={`/categories/${category.parentCategory.category_slug}`} className="text-blue-600 hover:underline">
            {category.parentCategory.category_name}
          </Link>
        </p>
      )}
      {category.childCategories && category.childCategories.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Subcategories</h3>
          <ul className="flex space-x-4">
            {category.childCategories.map((child) => (
              <li key={child.category_id}>
                <Link href={`/categories/${child.category_slug}`} className="text-blue-600 hover:underline">
                  {child.category_name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <h3 className="text-xl font-bold mb-4">Posts</h3>
      <ul className="space-y-2">
        {postsResponse.posts.map((post) => (
          <li key={post.post_id} className="p-3 bg-gray-50 rounded-md">
            <Link href={`/posts/${post.post_slug}`} className="text-blue-600 hover:underline">
              {post.translations[0]?.title || post.post_slug}
            </Link>
            <p className="text-sm text-gray-600">By {post.author.username}</p>
            <p className="text-sm text-gray-600">Views: {post.view_count}</p>
            {post.translations[0]?.excerpt && (
              <p className="text-sm text-gray-600">{post.translations[0].excerpt}</p>
            )}
          </li>
        ))}
      </ul>
      {postsResponse.pagination && (
        <div className="mt-4 flex justify-center space-x-2">
          {Array.from({ length: postsResponse.pagination.total_pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                page === postsResponse.pagination.current_page ? 'bg-blue-600 text-white' : 'bg-gray-200'
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