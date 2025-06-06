'use client';

import { useEffect, useState } from 'react';
import { getActivity } from '@/lib/api';
import { UserActivity } from '@/lib/types';

export default function ActivityPage() {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [pagination, setPagination] = useState<{
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await getActivity(page);
        setActivities(response.data.activities);
        setPagination(response.data.pagination);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load activity');
      }
    };
    fetchActivity();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Activity Log</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <ul className="space-y-2">
          {activities.map((activity, index) => (
            <li key={index} className="p-3 bg-gray-50 rounded-md">
              <p><strong>Action:</strong> {activity.action}</p>
              <p><strong>Resource:</strong> {activity.resource_type}</p>
              <p><strong>Date:</strong> {new Date(activity.created_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
        {pagination && (
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
            >
              Previous
            </button>
            <p>
              Page {pagination.current_page} of {pagination.total_pages}
            </p>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.total_pages}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}