// src/slices/productsApiSlice.js (Updated for Admin Endpoints)

import { apiSlice } from './apiSlice';
const PRODUCTS_URL = '/products';
const UPLOADS_URL = '/upload';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top`
      }), // This calls the new route
      keepUnusedDataFor: 5,
    }),

    getProducts: builder.query({
      // 🌟 FIX 1: Destructure pageNumber from params and give it a default 🌟
      query: ({ keyword = '', pageNumber = 1 } = {}) => ({ // Changed params to destructuring for clarity
        url: PRODUCTS_URL,
        params: {
          keyword: keyword,
          pageNumber: pageNumber, // 🌟 FIX 2: Include pageNumber in the API request 🌟
        },
      }),
      providesTags: ['Products'],
      keepUnusedDataFor: 5,
    }),

    // 2. Existing: Get product details (Public/Product Page)
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // 3. NEW: Admin Create Product (Mutation)
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL, // POST request to /api/products
        method: 'POST',
      }),
      // Invalidate the cache for the general product list view
      invalidatesTags: ['Product'],
    }),

    // 4. NEW: Admin Update Product (Mutation - Placeholder for later)
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    // 5. NEW: Admin Delete Product (Mutation)
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      // This is a simple delete; cache invalidation will trigger refresh
      invalidatesTags: ['Product'],
    }),

    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOADS_URL}`,
        method: 'POST',
        body: data, // 'data' is expected to be a FormData object containing the file
      }),
    }),

  }),
});

// Export the new hooks
export const {
  useGetTopProductsQuery,
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,   // <-- NEW
  useUpdateProductMutation,   // <-- NEW
  useDeleteProductMutation,   // <-- NEW
  useUploadProductImageMutation,
} = productsApiSlice;