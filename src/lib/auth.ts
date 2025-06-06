// import { User } from './types';

// export const setAuthToken = (token: string | null) => {
//   if (token) {
//     localStorage.setItem('access_token', token);
//   } else {
//     localStorage.removeItem('access_token');
//   }
// };

// export const getAuthToken = (): string | null => {
//   return localStorage.getItem('access_token');
// };

// export const setUser = (user: User | null) => {
//   if (user) {
//     localStorage.setItem('user', JSON.stringify(user));
//   } else {
//     localStorage.removeItem('user');
//   }
// };

// export const getUser = (): User | null => {
//   const user = localStorage.getItem('user');
//   return user ? JSON.parse(user) : null;
// };

// export const isAuthenticated = (): boolean => {
//   return !!getAuthToken() && !!getUser();
// };

// src/lib/auth.ts (or src/lib/api.ts - whichever file contains these functions)
import { User } from './types';

// Helper function to check if we're on the client side
const isClient = () => typeof window !== 'undefined';

export const setAuthToken = (token: string | null) => {
  if (!isClient()) return;
  
  if (token) {
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('access_token');
  }
};

export const getAuthToken = (): string | null => {
  if (!isClient()) return null;
  return localStorage.getItem('access_token');
};

export const setUser = (user: User | null) => {
  if (!isClient()) return;
  
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

export const getUser = (): User | null => {
  if (!isClient()) return null;
  
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): boolean => {
  if (!isClient()) return false;
  return !!getAuthToken() && !!getUser();
};