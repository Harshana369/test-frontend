'use client';

import { useEffect, useState } from 'react';
import { getSessions, deleteSession } from '@/lib/api';
import { UserSession } from '@/lib/types';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getSessions();
        setSessions(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load sessions');
      }
    };
    fetchSessions();
  }, []);

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      setSessions(sessions.filter((session) => session.session_id !== sessionId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete session');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Active Sessions</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <ul className="space-y-2">
          {sessions.map((session) => (
            <li key={session.session_id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
              <div>
                <p><strong>IP Address:</strong> {session.ip_address}</p>
                <p><strong>User Agent:</strong> {session.user_agent}</p>
                <p><strong>Created:</strong> {new Date(session.created_at).toLocaleDateString()}</p>
                <p><strong>Expires:</strong> {new Date(session.expires_at).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleDeleteSession(session.session_id)}
                className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}