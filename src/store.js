// src/store.js

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import { apiSlice } from './slices/apiSlice';

const store = configureStore({
    reducer: {
        // 1. Add the API slice reducer
        [apiSlice.reducerPath]: apiSlice.reducer,
        user: userReducer,
        cart: cartReducer,

    },
    // 2. Add the API middleware
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),

    devTools: process.env.NODE_ENV !== 'production',
});

export default store;