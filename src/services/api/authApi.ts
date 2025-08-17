import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AdminResponse, FormData, ReviewResponse, SuccessResponse, UserResponse } from '../../types/authTypes';

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    username: string;
    email?: string;
    phone_number?: string;
    is_admin: number;
    is_online: number;
    wallet_amount: string;
    is_banned: number;
    ban_reason: string | null;
    email_verified_at: string | null;
  };
}



const BaseUrl = import.meta.env.VITE_API_BASE;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: BaseUrl }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    /**
     * Register a new user
     */
    register: builder.mutation<AuthResponse, FormData>({
      query: (data) => ({
        url: 'register',
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Auth'],
    }),
    /**
     * Login a user
     */
    login: builder.mutation<AuthResponse, FormData>({
      query: (data) => ({
        url: 'login',
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Auth'],
    }),

    /**
     * Logout a user
     */
    logOut: builder.mutation<AuthResponse, string>({
      query: (token) => ({
        url: `logout`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['Auth'], // Invalidate auth-related cache
    }),

    /**
     * Reset password with phone number
     */
    resetPasswordPhone: builder.mutation<AuthResponse, FormData>({
      query: (data) => ({
        url: `reset-password-phone`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data
      }),
      invalidatesTags: ['Auth'], // Invalidate auth-related cache
    }),


    /**
     * get all user 
     */
    getAllUser: builder.query<UserResponse, string>({
      query: (token) => ({
        url: `users`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }),
    }),

    /**
     * Update Admin Status 
     */
    updateAdminStatus: builder.mutation<AuthResponse, { token: string, userId: number, isOnline: boolean }>({
      query: ({ token, userId, isOnline }) => ({
        url: `user/${userId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: { is_online: isOnline }
      }),
      invalidatesTags: ['Auth'],
    }),

    /**
   * GET user by id
   */
    getUsers: builder.query<UserResponse, string >({
      query: (token) => ({
        url: `users`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }),
    }),

    /**
     * UPDATE user wallet 
     */
    updateWallet: builder.mutation<AuthResponse, { token: string, userId: number, walletAmount: number }>({
      query: ({ token, userId, walletAmount }) => ({
        url: `user/${userId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: { wallet_amount: walletAmount }
      }),
      invalidatesTags: ['Auth'],
    }),

    /**
     * Block user
     */
    blockUser: builder.mutation<UserResponse, { token: string, userId: number, reason: string , isBanned: boolean}>({
      query: ({ token, userId, reason , isBanned}) => ({
        url: `user/${userId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: { ban_reason: reason , is_banned: isBanned}
      }),
      invalidatesTags: ['Auth'],
    }),


    /**
     * GET admin status
     */
    getAdminStatus: builder.query<AdminResponse, void>({
      query: () => ({
        url: `admin-status`,
        method: 'GET',
      }),
      providesTags: ['Auth'], // Provide auth-related cache tag
    }),


    /**
     * Get all user reviews
     */
    getUserReviews: builder.query<ReviewResponse, void>({
      query: () => ({
        url: `reviews`,
        method: 'GET',
      }),
      providesTags: ['Auth'], // Provide auth-related cache tag
    }),

    /**
     * DELETE USER reviews
     */
    deleteUserReview: builder.mutation<SuccessResponse, { token: string, reviewId: number }>({
      query: ({ token, reviewId }) => ({
        url: `reviews/${reviewId}`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogOutMutation,
  useResetPasswordPhoneMutation,
  useGetAllUserQuery,
  useUpdateAdminStatusMutation,
  useGetUsersQuery,
  useUpdateWalletMutation,
  useBlockUserMutation,
  useGetAdminStatusQuery,

  /// user reivews
  useGetUserReviewsQuery,
  useDeleteUserReviewMutation
} = authApi;
