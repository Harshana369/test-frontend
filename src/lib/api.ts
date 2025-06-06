import axios from 'axios';
import { AuthResponse, LoginFormData, RegisterFormData } from './types';

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

export const register = (data: RegisterFormData) => api.post<AuthResponse>('/auth/register', data);
export const login = (data: LoginFormData) => api.post<AuthResponse>('/auth/login', data);
export const logout = () => api.post<AuthResponse>('/auth/logout');
export const forgotPassword = (email: string) => api.post<AuthResponse>('/auth/forgot-password', { email });
export const resetPassword = (token: string, password: string) => 
  api.post<AuthResponse>('/auth/reset-password', { token, password });
export const verifyEmail = (token: string) => api.get<AuthResponse>(`/auth/verify-email/${token}`);
export const resendVerification = (email: string) => 
  api.post<AuthResponse>('/auth/resend-verification', { email });

export default api;