import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { productApi } from './api/productApi';
import { authApi } from './api/authApi';


export const store = configureStore({
    reducer: {
        //  API reducers
        [authApi.reducerPath]: authApi.reducer,
        // [ServicesApi.reducerPath]: ServicesApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        // [ReviewAPI.reducerPath]: ReviewAPI.reducer,
        // [messageAPI.reducerPath]: messageAPI.reducer,
        // [orderAPI.reducerPath]: orderAPI.reducer,


        //Slice 
        // order:orderSlice.reducer,
        // services:servicesSlice.reducer,

    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            //   ServicesApi.middleware,
            productApi.middleware,
            //   ReviewAPI.middleware,
            //   messageAPI.middleware,
            //   orderAPI.middleware,
        ),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;