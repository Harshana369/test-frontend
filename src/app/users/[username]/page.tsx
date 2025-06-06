'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getUserByUsername, getUserPosts } from '@/lib/api';

export default function UserProfilePage() {
  const { username } = useParams();
  const [user, setUser] = useState<any | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<{
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await getUserByUsername(username as string);
        setUser(userResponse.data);
        const postsResponse = await getUserPosts(username as string, page);
        setPosts(postsResponse.data.posts);
        setPagination(postsResponse.data.pagination);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load user data');
      }
    };
    fetchUserData();
  }, [username, page]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {user && (
          <>
            <h2 className="text-2xl font-bold mb-4">{user.username}'s Profile</h2>
            <div className="flex items-center space-x-4 mb-6">
              {user.avatar_url && (
                <img src={user.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full" />
              )}
              <div>
                <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                <p><strong>Bio:</strong> {user.bio || 'No bio available'}</p>
                <p><strong>Posts:</strong> {user.posts_count}</p>
                <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4">Posts</h3>
            <ul className="space-y-2">
              {posts.map((post) => (
                <li key={post.post_id} className="p-3 bg-gray-50 rounded-md">
                  <p><strong>Title:</strong> {post.title || post.post_slug}</p>
                  <p><strong>Status:</strong> {post.status}</p>
                  <p><strong>Published:</strong> {new Date(post.published_at).toLocaleDateString()}</p>
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
          </>
        )}
      </div>
    </div>
  );
}