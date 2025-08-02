import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AllProductsResponse, GameResponse, MonthlySalesResponse, MonthlyTargetResponse, OrderResponse, StatisticsChartResponse } from '../../types/productType';

const BaseUrl = import.meta.env.VITE_API_BASE;

type confirmOrderProps = {
    success: boolean;
    message: string;
}

export const productApi = createApi({
    reducerPath: 'products',
    baseQuery: fetchBaseQuery({ baseUrl: BaseUrl }),
    tagTypes: ['product'],
    endpoints: (builder) => ({
        /**
         * Get all Products
         */
        getProducts: builder.query<AllProductsResponse, void>({
            query: () => {
                return {
                    url: `allproducts`,
                    method: 'GET',
                };
            },
            providesTags: ['product'],
        }),



        /**
         * Get Game Type 
         */
        getGamesType: builder.query<GameResponse, void>({
            query: () => ({
                url: `games`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            providesTags: ['product'],
        }),

        /**
         * Get all order 
         */
        getAllOrders: builder.query<OrderResponse, string>({
            query: (token) => ({
                url: `orders/all`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }),
            providesTags: ['product'],
        }),

        /**
         * Confirm Order 
         */
        confirmOrder: builder.mutation<confirmOrderProps, {token:string , order_id:number}>({
            query: ({token,order_id}) => ({
                url: `orders/${order_id}/confirm`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }),
            invalidatesTags: ['product'], // Invalidate auth-related cache
        }),

        /**
         * GET order monthly sales
         */
        getOrderMonthlySales: builder.query<MonthlySalesResponse, string>({
            query: (token) => ({
                url: `monthly-sales`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }),
            providesTags: ['product'],
        }),

        /**
         * GET order monthly target
         */
        getOrderMonthlyTarget: builder.query<MonthlyTargetResponse, string>({
            query: (token) => ({
                url: `monthly-target`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }),
            providesTags: ['product'],
        }),

        /**
         * GET order statistics chart
         */
        getStatisticsChart: builder.query<StatisticsChartResponse, string>({
            query: (token) => ({
                url: `stats-monthly`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }),
            providesTags: ['product'],
        }),

    }),
})
export const {
    useGetProductsQuery,
    useGetGamesTypeQuery,
    useGetAllOrdersQuery,
    useGetOrderMonthlySalesQuery,
    useGetOrderMonthlyTargetQuery,
    useGetStatisticsChartQuery,
    useConfirmOrderMutation
} = productApi;
