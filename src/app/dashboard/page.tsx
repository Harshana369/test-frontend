'use client';

import { useEffect, useState } from 'react';
import { getDashboard } from '@/lib/api';
import { UserDashboard } from '@/lib/types';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<UserDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboard();
        setDashboard(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      }
    };
    fetchDashboard();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-md">
            <h3 className="text-lg font-semibold">Posts</h3>
            <p className="text-2xl">{dashboard.stats.posts_count}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-md">
            <h3 className="text-lg font-semibold">Comments</h3>
            <p className="text-2xl">{dashboard.stats.comments_count}</p>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-4">Recent Posts</h3>
        <ul className="space-y-2">
          {dashboard.recent_posts.map((post) => (
            <li key={post.post_id} className="p-3 bg-gray-50 rounded-md">
              <p><strong>Slug:</strong> {post.post_slug}</p>
              <p><strong>Status:</strong> {post.status}</p>
              <p><strong>Views:</strong> {post.view_count}</p>
              <p><strong>Created:</strong> {new Date(post.created_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-4">Recent Activity</h3>
        <ul className="space-y-2">
          {dashboard.recent_activity.map((activity, index) => (
            <li key={index} className="p-3 bg-gray-50 rounded-md">
              <p><strong>Action:</strong> {activity.action}</p>
              <p><strong>Resource:</strong> {activity.resource_type}</p>
              <p><strong>Date:</strong> {new Date(activity.created_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}