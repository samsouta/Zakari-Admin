import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GameResponse, ServicesType } from '../../types/productType';





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
     * GET Game Service List
     */
    getGameServiceList: builder.query<ServicesType[], void>({
      query: () => ({
        url: `services`,
        method: 'GET',
      }),
      providesTags: ['game'], // Provide auth-related cache tag
    }),

  }),
});

export const {
    useGetGameListQuery
} = gameApi;
