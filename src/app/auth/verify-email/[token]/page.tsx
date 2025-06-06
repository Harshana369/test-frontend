'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { verifyEmail } from '@/lib/api';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const router = useRouter();
  const [message, setMessage] = useState<string>('Verifying email...');
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await verifyEmail(token as string);
        if (response.data.success) {
          setMessage(response.data.message);
          setTimeout(() => router.push('/auth/login'), 2000);
        } else {
          setMessage(response.data.message);
          setIsError(true);
        }
      } catch (err: any) {
        setMessage(err.response?.data?.message || 'An error occurred');
        setIsError(true);
      }
    };
    verify();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        <p className={isError ? 'text-red-600' : 'text-green-600'}>{message}</p>
      </div>
    </div>
  );
}