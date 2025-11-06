// src/slices/ordersApiSlice.js

import { apiSlice } from './apiSlice'; // Import the base API slice

const ORDERS_URL = '/orders';

// Inject new endpoints into the base API slice
export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // 1. MUTATION: Endpoint for creating a new order
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL, // POST request to /api/orders
                method: 'POST',
                body: order, // The order object (items, address, payment)
            }),
            // Invalidates the 'Order' tag, so any list of orders (e.g., in Admin view) will re-fetch
            invalidatesTags: ['Order'],
        }),

        // Add endpoint for getting order details later
        // NEW: Query to get a single order by ID
        getOrderDetails: builder.query({
            query: (id) => ({
                url: `${ORDERS_URL}/${id}`, // GET request to /api/orders/:id
            }),
            providesTags: (result, error, id) => [{ type: 'Order', id }],
            keepUnusedDataFor: 5,
        }),

        // NEW: Query to get all orders for the logged-in user
        getMyOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/myorders`, // GET request to /api/orders/myorders
            }),
            providesTags: ['Order'], // Provides the 'Order' tag for the whole list
            keepUnusedDataFor: 5,
        }),

        // NEW: 4. MUTATION: Endpoint for marking an order as paid
        payOrder: builder.mutation({
            // Takes an object with { orderId, details }
            query: ({ orderId, details }) => ({
                url: `${ORDERS_URL}/${orderId}/pay`, // PUT request to /api/orders/:id/pay
                method: 'PUT',
                body: details, // PayPal payment result details
            }),
            // Invalidates the specific order cache to force a refresh on the OrderScreen
            invalidatesTags: (result, error, { orderId }) => [{ type: 'Order', id: orderId }],
        }),
        
        // NEW: 5. QUERY: Endpoint to get PayPal client ID (Configuration)
        getPayPalClientId: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/config/paypal`, // GET request to /api/orders/config/paypal
            }),
            // Keep the data cached for a longer time as the ID rarely changes
            keepUnusedDataFor: 5 * 60, // 5 minutes
        }),

    }),
});

// RTK Query generates the mutation hook: createOrder -> useCreateOrderMutation
export const { useCreateOrderMutation, useGetOrderDetailsQuery, useGetMyOrdersQuery, usePayOrderMutation, useGetPayPalClientIdQuery } = ordersApiSlice;