'use client';

import Link from 'next/link';
import { Category } from '@/lib/types';

interface CategoryCardProps {
  category: Category;
  showCount?: boolean;
  showChildren?: boolean;
}

export default function CategoryCard({ category, showCount = false, showChildren = false }: CategoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <Link href={`/categories/${category.category_slug}`}>
        <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 mb-2">
          {category.category_name}
        </h3>
      </Link>
      
      {category.description && (
        <p className="text-gray-600 mb-4 line-clamp-3">{category.description}</p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        {showCount && category.post_count !== undefined && (
          <span>{category.post_count} post{category.post_count !== 1 ? 's' : ''}</span>
        )}
        
        {showChildren && category.childCategories && category.childCategories.length > 0 && (
          <span>{category.childCategories.length} subcategories</span>
        )}
      </div>
      
      {showChildren && category.childCategories && category.childCategories.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {category.childCategories.slice(0, 3).map((child) => (
              <Link
                key={child.category_id}
                href={`/categories/${child.category_slug}`}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
              >
                {child.category_name}
              </Link>
            ))}
            {category.childCategories.length > 3 && (
              <span className="text-xs text-gray-500">+{category.childCategories.length - 3} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
