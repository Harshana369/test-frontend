'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getProfile, updateProfile, deleteProfile, changePassword } from '@/lib/api';
import { setAuthToken, setUser } from '@/lib/auth';
import { User } from '@/lib/types';

const profileSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  bio: z.string().optional(),
  avatar_url: z.string().url('Invalid URL').optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(8, 'Current password must be at least 8 characters'),
  new_password: z.string().min(8, 'New password must be at least 8 characters'),
});

type ProfileFormInputs = z.infer<typeof profileSchema>;
type PasswordFormInputs = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUserState] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordFormInputs>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();

        console.log(response.data)

        setUserState(response.data);
        setValue('first_name', response.data.first_name || '');
        setValue('last_name', response.data.last_name || '');
        setValue('bio', response.data.bio || '');
        setValue('avatar_url', response.data.avatar_url || '');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile');
      }
    };
    fetchProfile();
  }, [setValue]);

  const onProfileSubmit: SubmitHandler<ProfileFormInputs> = async (data) => {
    try {
      setError(null);
      setSuccess(null);
      const response = await updateProfile(data);
      setUserState(response.data.user);
      setUser(response.data.user); // Update local storage
      setSuccess(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const onPasswordSubmit: SubmitHandler<PasswordFormInputs> = async (data) => {
    try {
      setError(null);
      setSuccess(null);
      const response = await changePassword(data);
      setSuccess(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleDeleteProfile = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteProfile();
        setAuthToken(null);
        setUser(null);
        router.push('/auth/login');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete profile');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>

        {/* Profile Form */}
        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              {...registerProfile('first_name')}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
            {profileErrors.first_name && (
              <p className="mt-1 text-sm text-red-600">{profileErrors.first_name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              {...registerProfile('last_name')}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
            {profileErrors.last_name && (
              <p className="mt-1 text-sm text-red-600">{profileErrors.last_name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              {...registerProfile('bio')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
            {profileErrors.bio && (
              <p className="mt-1 text-sm text-red-600">{profileErrors.bio.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
            <input
              {...registerProfile('avatar_url')}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
            {profileErrors.avatar_url && (
              <p className="mt-1 text-sm text-red-600">{profileErrors.avatar_url.message}</p>
            )}
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
            disabled={isProfileSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isProfileSubmitting ? 'Submitting...' : 'Update Profile'}
          </button>
        </form>

        {/* Password Change Form */}
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4 mt-6">
          <h3 className="text-xl font-bold">Change Password</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              {...registerPassword('current_password')}
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
            {passwordErrors.current_password && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.current_password.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              {...registerPassword('new_password')}
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
            {passwordErrors.new_password && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.new_password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isPasswordSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isPasswordSubmitting ? 'Submitting...' : 'Change Password'}
          </button>
        </form>

        {/* Delete Account */}
        <div className="mt-6">
          <button
            onClick={handleDeleteProfile}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}