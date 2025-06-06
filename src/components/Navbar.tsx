'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {  isAuthenticated, getUser } from '@/lib/auth';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = async () => {
    try {
    //   await logout();
      setUser(null);
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          My Blog
        </Link>
        <div className="space-x-4">
          {isAuthenticated() && user ? (
            <>
              <span className="text-white">Welcome, {user.username}</span>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-white hover:text-gray-200">
                Login
              </Link>
              <Link href="/auth/register" className="text-white hover:text-gray-200">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}