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
  email_verified_at: string | null;
}
export interface UserResponse {
  success: boolean;
  message: string;
  data: UserType[];
  today_count: number;
  yesterday_count: number;
}