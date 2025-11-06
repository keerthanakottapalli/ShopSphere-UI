// src/slices/usersApiSlice.js (NEW - RTK Query)

import { apiSlice } from './apiSlice'; // Import the base API slice

const USERS_URL = '/users';

// Inject new endpoints into the base API slice
export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        
        // 1. MUTATION: Login Endpoint
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/login`, // POST to /api/users/login
                method: 'POST',
                body: data, // { email, password }
            }),
        }),

        // 2. MUTATION: Register Endpoint
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`, // POST to /api/users
                method: 'POST',
                body: data, // { name, email, password }
            }),
        }),
        
        // 3. MUTATION: Logout Endpoint (Simple POST request, no body needed)
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`, // POST to /api/users/logout
                method: 'POST',
            }),
        }),

        // 4. MUTATION: Update User Profile
        updateUserProfile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`, // PUT to /api/users/profile
                method: 'PUT',
                body: data, // { _id, name, email, password }
            }),
            // Use 'User' tag to potentially invalidate other user queries if needed
            invalidatesTags: ['User'], 
        }),
    }),
});

// Export all the hooks for use in components
export const { 
    useLoginMutation, 
    useRegisterMutation, 
    useLogoutMutation,
    useUpdateUserProfileMutation, // <-- The one we need for ProfileScreen
} = usersApiSlice;