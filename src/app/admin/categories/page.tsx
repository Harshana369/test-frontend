'use client';

import { useState, useEffect } from 'react';
import { getCategories, deleteCategory, reorderCategories } from '@/lib/api';
import { Category } from '@/lib/types';
import AdminCategoryForm from '@/components/AdminCategoryForm';
import { isAuthenticated, getUser } from '@/lib/auth';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[0]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    const user = getUser();
    setIsAdmin(user?.role === 'admin'); // Assuming role is part of User type
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories({ active_only: false, parent_only: false, include_count: true });
        setCategories(response.data.categories);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      setError(null);
      setSuccess(null);
      await deleteCategory(id);
      setSuccess('Category deleted successfully');
      const response = await getCategories({ active_only: false, parent_only: false, include_count: true });
      setCategories(response.data.categories);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const reorderedCategories = Array.from(categories);
    const [movedCategory] = reorderedCategories.splice(result.source.index, 1);
    reorderedCategories.splice(result.destination.index, 0, movedCategory);

    setCategories(reorderedCategories);

    try {
      await reorderCategories(
        reorderedCategories.map((cat, index) => ({
          id: cat.category_id,
          sort_order: index,
        }))
      );
      setSuccess('Categories reordered successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reorder categories');
      // Revert on error
      const response = await getCategories({ active_only: false, parent_only: false, include_count: true });
      setCategories(response.data.categories);
    }
  };

  if (!isAuthenticated() || !isAdmin) {
    return <p className="text-red-600 text-center">Access denied. Admin only.</p>;
  }

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Manage Categories</h2>
        <AdminCategoryForm category={editingCategory} />
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md mb-4">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}
        <h3 className="text-xl font-bold mb-4">Category List</h3>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {categories.map((category, index) => (
                  <Draggable key={category.category_id} draggableId={category.category_id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-3 bg-gray-50 rounded-md flex justify-between items-center"
                      >
                        <div>
                          <span>{category.category_name}</span>
                          <span className="ml-2 text-sm text-gray-600">({category.post_count || 0} posts)</span>
                          {category.description && <p className="text-sm text-gray-600">{category.description}</p>}
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category.category_id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}