import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GameResponse, GameType, ServiceByIdResponse, ServicesType } from '../../types/productType';
import { AddServiceFormData } from '../../components/productManagement/AddServiceProductModal';
import { GameProductFormData } from '../../components/productManagement/AddGameProductModal';


interface AddServiceResponse {
  success: boolean;
  message: string;
}




const BaseUrl = import.meta.env.VITE_API_BASE;

export const gameApi = createApi({
  reducerPath: 'game',
  baseQuery: fetchBaseQuery({ baseUrl: BaseUrl }),
  tagTypes: ['game'],
  endpoints: (builder) => ({

    /**
     * GET game list
     */
    getGameList: builder.query<GameResponse, void>({
      query: () => ({
        url: `games`,
        method: 'GET',
      }),
      providesTags: ['game'], // Provide auth-related cache tag
    }),

    /**
     * GET game by ID 
     */
    getGameById: builder.query<GameType, number | null>({
      query: (id) => {
        if (id !== null) {
          return {
            url: `games/${id}`,
            method: 'GET',
          };
        }
        return {
          url: 'games',
          method: 'GET',
        };
      },
      providesTags: ['game'],
    }),

    /**
     * POST add game type
     */
    addGame: builder.mutation<AddServiceResponse, { token: string, data: GameProductFormData }>({
      query: ({ token, data }) => ({
        url: `games`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      }),
      invalidatesTags: ['game'],
    }),

    /**
     * PUT edit game type
     */
    updateGame: builder.mutation<AddServiceResponse, { token: string, id: number, data: GameProductFormData }>({
      query: ({ token, id, data }) => ({
        url: `games/${id}`,
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      }),
      invalidatesTags: ['game'],
    }),


    /**
     * DELETE game type
     */
    deleteGame: builder.mutation<AddServiceResponse, { token: string, id: number }>({
      query: ({ token, id }) => ({
        url: `games/${id}`,
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }),
      invalidatesTags: ['game'],
    }),


    /**
     * GET Service List
     */
    getGameServiceList: builder.query<ServicesType[], void>({
      query: () => ({
        url: `services`,
        method: 'GET',
      }),
      providesTags: ['game'], // Provide auth-related cache tag
    }),

    /**
     * GET service by id 
     */
    getServiceById: builder.query<ServiceByIdResponse, number | null>({
      query: (id) => {
        if (id !== null) {
          return {
            url: `services/${id}`,
            method: 'GET',
          };
        }
        return {
          url: 'services',
          method: 'GET',
        };
      },
      providesTags: ['game'], // Provide auth-related cache tag
    }),

    /**
     * POST Add service 
     */
    addService: builder.mutation<AddServiceResponse, { token: string, data: AddServiceFormData }>({
      query: ({ token, data }) => ({
        url: `services`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      }),
      invalidatesTags: ['game'],
    }),

    /**
     * PUT update service 
     */
    updateService: builder.mutation<AddServiceResponse, { token: string, id: number, data: AddServiceFormData }>({
      query: ({ token, id, data }) => ({
        url: `services/${id}`,
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      }),
      invalidatesTags: ['game'],
    }),

    /**
     * DELETE service by id 
     */
    deleteService: builder.mutation<AddServiceResponse, { token: string, id: number }>({
      query: ({ token, id }) => ({
        url: `services/${id}`,
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }),
      invalidatesTags: ['game'],
    }),

  }),
});

export const {
  useGetGameListQuery,
  useAddServiceMutation,
  useUpdateServiceMutation,
  useGetServiceByIdQuery,
  useDeleteServiceMutation,
  useGetGameByIdQuery,
  useAddGameMutation,
  useUpdateGameMutation,
  useDeleteGameMutation
} = gameApi;
