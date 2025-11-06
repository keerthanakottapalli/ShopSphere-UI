// src/slices/apiSlice.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// 1. Create the Base Query function
const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api`,
  credentials: 'include',

  // Add this prepareHeaders function to inject the token
  prepareHeaders: (headers, { getState }) => {
    // Get the user info from the Redux state (assuming user slice stores the token)
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
  baseQuery, // Use the updated baseQuery
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({
    // All your specific endpoints will inherit this.
  }),
});

// We don't export hooks from here; they will be exported from the injected slices.