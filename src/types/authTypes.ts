export interface FormData {
    username?: string;
    phone_number: string;
    email?: string;
    password: string;
    password_confirmation?: string;
    rememberMe?: boolean;
  }
  
  export interface ValidationErrors {
    [key: string]: string;
  }


export type UserType = {
  id: number;
  username: string;
  phone_number: string;
  email: string | null;
  is_admin: boolean;
  is_online: boolean;
  banned_at?: string ;
  wallet_amount: string;
  is_banned: boolean;
  ban_reason: string | null;
  created_at: string;
  email_verified_at: string | null;
}
export interface UserResponse {
  success: boolean;
  message: string;
  data: UserType[];
  today_count: number;
  yesterday_count: number;
}

export interface AdminResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    username: string;
    is_online: boolean;
  }[];
}

/**
 * User Review Types
 */

export type ReviewUser = {
  id: number;
  username: string;
}

export type ReviewType = {
  id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: ReviewUser;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: ReviewType[];
}

export type SuccessResponse = {
  success: boolean;
  message: string;
}
