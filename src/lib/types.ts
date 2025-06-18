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
  role: string;
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

export interface Category {
  category_id: string;
  category_name: string;
  category_slug: string;
  description?: string;
  parent_category_id?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  post_count?: number;
  parentCategory?: Category;
  childCategories?: Category[];
  children?: Category[];
}

export interface Post {
  post_id: string;
  post_slug: string;
  status: string;
  view_count: number;
  published_at?: string;
  created_at: string;
  author: User;
  category: Category;
  translations: PostTranslation[];
}

export interface PostTranslation {
  translation_id: string;
  title: string;
  excerpt?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface CategoryResponse {
  categories: Category[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number | Category[];
    per_page: number;
  };
}

export interface CategoryPostsResponse {
  category: Category;
  posts: Post[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}