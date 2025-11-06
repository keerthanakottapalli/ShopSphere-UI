// src/slices/apiSlice.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// The base URL for our backend API
const BASE_URL = '/api'; // Assumes your backend runs on the same host/port (using a proxy)

// 1. Create the Base Query function
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  // Add this prepareHeaders function to inject the token
  prepareHeaders: (headers, { getState }) => {
    // Get the user info from the Redux state
    const token = getState().user.userInfo?.token;
    
    // Check if a token exists and attach it as a Bearer token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
});

// 2. Create the API Slice
export const apiSlice = createApi({
  baseQuery, // Use the updated baseQuery with token injection
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({
    // All your specific endpoints (productsApiSlice, usersApiSlice, ordersApiSlice)
    // will inherit this baseQuery and get the token automatically
  }),
});

// We don't export hooks from here; they will be exported from the injected slices.