import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AllProductsResponse, FormProps, GameResponse, GetProductWithIdResponse, MonthlySalesResponse, MonthlyTargetResponse, OrderResponse, ServiceResponse, StatisticsChartResponse } from '../../types/productType';
import { GetTopUpResponse } from '../../types/TopUpType';

const BaseUrl = import.meta.env.VITE_API_BASE;

type confirmOrderProps = {
    success: boolean;
    message: string;
}

type DeleteProductProps = {
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
         * GET product with id 
         */
        getProductsWithId: builder.query<GetProductWithIdResponse, number | null>({
            query: (id) => {
                if (id !== null) {
                    return {
                        url: `products/${id}`,
                        method: 'GET',
                    };
                }
                return {
                    url: 'products',
                    method: 'GET',
                };
            },
            providesTags: ['product'],
        }),

        /**
         * POST PRODUCT 
         */
        addProduct: builder.mutation<AllProductsResponse, { token: string, formData: FormProps }>({
            query: ({ token, formData }) => ({
                url: `products`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            }),
            invalidatesTags: ['product'],
        }),

        /**
         * PUT product 
         */
        editProduct: builder.mutation<AllProductsResponse, { token: string, formData: FormProps, id: number }>({
            query: ({ token, formData, id }) => ({
                url: `products/${id}`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            }),
            invalidatesTags: ['product'],
        }),

        /**
         * DELETE PRODUCT 
         */
        deleteProduct: builder.mutation<DeleteProductProps, { token: string, id: number }>({
            query: ({ token, id }) => ({
                url: `products/${id}`,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }),
            invalidatesTags: ['product'],
        }),


        /**
         * Get service list
         */
        getServices: builder.query<ServiceResponse, void>({
            query: () => ({
                url: `services`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
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
        * Get order 
        */
        getOrders: builder.query<OrderResponse, { token: string; service_id?: number; game_slug?: string }>({
            query: ({ token, service_id, game_slug }) => {
                const params = new URLSearchParams();

                if (game_slug) params.append("game_slug", game_slug);
                if (service_id !== undefined) params.append("service_id", service_id.toString());

                const queryString = params.toString(); // builds clean query string
                return {
                    url: `orders/all${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                };
            },
            providesTags: ["product"],
        }),


        /**
         * Confirm Order 
         */
        confirmOrder: builder.mutation<confirmOrderProps, { token: string, order_id: number }>({
            query: ({ token, order_id }) => ({
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

        /**
         * GET All Top-Up Order 
         */
        getTopUpOrders: builder.query<GetTopUpResponse, string>({
            query: (token) => ({
                url: `admin/topup-orders`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }),
            providesTags: ['product'],
        }),
        /**
         * UPDATE TOP UP 
         */
        updateTopUp: builder.mutation<GetTopUpResponse, { token: string, order_id: number }>({
            query: ({ token, order_id }) => ({
                url: `topup-orders/${order_id}`,
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: {
                    status: 'confirmed'
                }
            }),
            invalidatesTags: ['product'],
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
    useConfirmOrderMutation,
    useGetOrdersQuery,
    useGetServicesQuery,
    useAddProductMutation,
    useEditProductMutation,
    useGetProductsWithIdQuery,
    useDeleteProductMutation,
    useGetTopUpOrdersQuery,
    useUpdateTopUpMutation
} = productApi;
