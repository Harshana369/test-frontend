'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { createCategory, updateCategory, getCategories } from '@/lib/api';
import { Category } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUser } from '@/lib/auth';

interface AdminCategoryFormProps {
  category?: Category;
}

const categorySchema = z.object({
  category_name: z.string().min(1, 'Category name is required'),
  category_slug: z.string().min(1, 'Category slug is required'),
  description: z.string().optional(),
  parent_category_id: z.string().optional().nullable(),
  sort_order: z.number().min(0, 'Sort order must be 0 or greater').default(0),
  is_active: z.boolean().default(true),
});

type CategoryFormInputs = z.infer<typeof categorySchema>;

export default function AdminCategoryForm({ category }: AdminCategoryFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormInputs>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          category_name: category.category_name,
          category_slug: category.category_slug,
          description: category.description,
          parent_category_id: 1,
          sort_order: category.sort_order,
          is_active: category.is_active,
        }
      : { sort_order: 0, is_active: true },
  });

  useEffect(() => {
    const user = getUser();
    setIsAdmin(user?.role === 'admin'); 
    const fetchCategories = async () => {
      try {
        const response = await getCategories({ active_only: false, parent_only: false });
        setCategories(response.data.categories);
      } catch (err: any) {
        setError('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const onSubmit: SubmitHandler<CategoryFormInputs> = async (data) => {
    try {
      setError(null);
      setSuccess(null);

      if (category) {
        // Update category
        const response = await updateCategory(category.category_id, data);
        setSuccess(response.data.message);
      } else {
        // Create category
        const response = await createCategory(data);
        setSuccess(response.data.message);
        reset();
      }
      // Refresh categories list
      const response = await getCategories({ active_only: false, parent_only: false });
      setCategories(response.data.categories);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  if (!isAdmin) {
    return <p className="text-red-600 text-center">Access denied. Admin only.</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">{category ? 'Update Category' : 'Create Category'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category Name *</label>
          <input
            {...register('category_name')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            placeholder="Enter category name"
          />
          {errors.category_name && (
            <p className="mt-1 text-sm text-red-600">{errors.category_name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category Slug *</label>
          <input
            {...register('category_slug')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            placeholder="Enter category slug"
          />
          {errors.category_slug && (
            <p className="mt-1 text-sm text-red-600">{errors.category_slug.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            placeholder="Enter description"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Parent Category</label>
          <select
            {...register('parent_category_id')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
          >
            <option value="">None</option>
            {categories
              .filter((cat) => cat.category_id !== category?.category_id)
              .map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sort Order</label>
          <input
            {...register('sort_order', { valueAsNumber: true })}
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            placeholder="Enter sort order"
          />
          {errors.sort_order && (
            <p className="mt-1 text-sm text-red-600">{errors.sort_order.message}</p>
          )}
        </div>
        <div className="flex items-center">
          <input
            {...register('is_active')}
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Active</label>
        </div>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : category ? 'Update Category' : 'Create Category'}
        </button>
      </form>
    </div>
  );
}