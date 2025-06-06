// src/lib/types.ts

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    access_token?: string;
    user?: User;
  };
}

export interface LoginFormData {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface UserDashboard {
  stats: {
    posts_count: number;
    comments_count: number;
  };
  recent_posts: {
    post_id: number;
    post_slug: string;
    status: string;
    view_count: number;
    created_at: string;
  }[];
  recent_activity: {
    action: string;
    resource_type: string;
    created_at: string;
  }[];
}

export interface UserActivity {
  action: string;
  resource_type: string;
  created_at: string;
}

export interface UserSession {
  session_id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  expires_at: string;
}