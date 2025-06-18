// src/lib/api.ts

import axios from 'axios';
import { AuthResponse, LoginFormData, RegisterFormData, User, UserDashboard, UserActivity, UserSession, CategoryResponse, Category, CategoryPostsResponse } from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && error.config && !error.config.__isRetryRequest) {
      try {
        const response = await api.post<AuthResponse>('/auth/refresh');
        if (response.data.success && response.data.data?.access_token) {
          localStorage.setItem('access_token', response.data.data.access_token);
          error.config.headers.Authorization = `Bearer ${response.data.data.access_token}`;
          error.config.__isRetryRequest = true;
          return api(error.config);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const register = (data: RegisterFormData) => api.post<AuthResponse>('/auth/register', data);

export const login = (data: LoginFormData) => api.post<AuthResponse>('/auth/login', data);

export const logout = () => api.post<AuthResponse>('/auth/logout');

export const forgotPassword = (email: string) => api.post<AuthResponse>('/auth/forgot-password', { email });

export const resetPassword = (token: string, password: string) => 
  api.post<AuthResponse>('/auth/reset-password', { token, password });

export const verifyEmail = (token: string) => api.get<AuthResponse>(`/auth/verify-email/${token}`);

export const resendVerification = (email: string) => 
  api.post<AuthResponse>('/auth/resend-verification', { email });

// UserController endpoints
export const getProfile = () => api.get<User>('/users/profile');

export const updateProfile = (data: Partial<User>) => api.put<{ message: string; user: User }>('/users/profile', data);

export const deleteProfile = () => api.delete<{ message: string }>('/users/profile');

export const changePassword = (data: { current_password: string; new_password: string }) => 
  api.post<{ message: string }>('/users/change-password', data);

export const getDashboard = () => api.get<UserDashboard>('/users/dashboard');

export const getActivity = (page: number = 1, limit: number = 20) => 
  api.get<{ activities: UserActivity[]; pagination: { current_page: number; total_pages: number; total_items: number; items_per_page: number } }>(
    `/users/activity?page=${page}&limit=${limit}`
  );
export const getSessions = () => api.get<UserSession[]>('/users/sessions');

export const deleteSession = (sessionId: string) => api.delete<{ message: string }>(`/users/sessions/${sessionId}`);

export const getUserByUsername = (username: string) => 
  api.get<{ user_id: number; username: string; first_name?: string; last_name?: string; avatar_url?: string; bio?: string; created_at: string; posts_count: number }>(
    `/users/${username}`
  );
  
export const getUserPosts = (username: string, page: number = 1, limit: number = 10) => 
  api.get<{
    posts: any[]; // Replace with proper Post type if defined
    pagination: { current_page: number; total_pages: number; total_items: number; items_per_page: number }
  }>(`/users/${username}/posts?page=${page}&limit=${limit}`);


export const getCategories = (params: {
  page?: number;
  limit?: number;
  active_only?: boolean;
  include_count?: boolean;
  parent_only?: boolean;
} = {}) =>
  api.get<CategoryResponse>('/categories', {
    params: {
      page: params.page || 1,
      limit: params.limit || 20,
      active_only: params.active_only !== undefined ? params.active_only : true,
      include_count: params.include_count || false,
      parent_only: params.parent_only || false,
    },
  });

export const getCategoryTree = (active_only: boolean = true) =>
  api.get<{ categories: Category[] }>('/categories/tree', {
    params: { active_only },
  });

export const getCategoryBySlug = (slug: string) =>
  api.get<{ category: Category }>(`/categories/${slug}`);

export const getCategoryPosts = (slug: string, params: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  language?: string;
} = {}) =>
  api.get<CategoryPostsResponse>(`/categories/${slug}/posts`, {
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      sort: params.sort || 'published_at',
      order: params.order || 'DESC',
      language: params.language || 'en',
    },
  });

export const createCategory = (data: {
  category_name: string;
  category_slug: string;
  description?: string;
  parent_category_id?: string;
  sort_order?: number;
}) => api.post<{ message: string; category: Category }>('/categories', data);

export const updateCategory = (
  id: string,
  data: {
    category_name?: string;
    category_slug?: string;
    description?: string;
    parent_category_id?: string | null;
    sort_order?: number;
    is_active?: boolean;
  }
) => api.put<{ message: string; category: Category }>(`/categories/${id}`, data);

export const deleteCategory = (id: string) =>
  api.delete<{ message: string }>(`/categories/${id}`);

export const reorderCategories = (categories: { id: string; sort_order: number }[]) =>
  api.post<{ message: string }>('/categories/reorder', { categories });



export default api;