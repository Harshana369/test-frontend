export interface User {
    user_id: string;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    status: 'active' | 'inactive' | 'suspended';
    last_login?: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
      user?: User;
      access_token?: string;
      token_type?: string;
      expires_in?: number;
    };
    errors?: Array<{ msg: string; param: string }>;
  }
  
  export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }
  
  export interface LoginFormData {
    email: string;
    password: string;
    remember_me: boolean;
  }