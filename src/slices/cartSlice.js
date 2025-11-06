// src/slices/cartSlice.js

import { createSlice } from '@reduxjs/toolkit';

// 1. Initial State: Load state from local storage, including new checkout fields
const initialState = localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : {
        cartItems: [],
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
        shippingAddress: {}, // New field for shipping address
        paymentMethod: 'PayPal', // New field with a default payment method
    };

// 2. Helper function to update common cart calculations (DRY principle)
const updateCart = (state) => {
    // Calculate items price (sum of item price * qty)
    const itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    );

    // Set prices (we'll use dummy values for now, calculation logic comes later)
    // NOTE: Prices should typically be integers to avoid floating point issues.
    // For display, we'll convert to a fixed decimal string.

    // 1. Items Price
    state.itemsPrice = Number(itemsPrice.toFixed(2));

    // 2. Shipping Price (Example: If order is over $100, shipping is $0, else $10)
    state.shippingPrice = Number((itemsPrice > 100 ? 0 : 10).toFixed(2));

    // 3. Tax Price (Example: 2% tax)
    state.taxPrice = Number((0.02 * itemsPrice).toFixed(2));

    // 4. Total Price
    state.totalPrice = Number(
        (state.itemsPrice + state.shippingPrice + state.taxPrice).toFixed(2)
    );

    // 5. Save to local storage
    localStorage.setItem('cart', JSON.stringify(state));

    return state;
};


// 3. Create the Cart Slice
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemToCart: (state, action) => {
            const item = action.payload; // The item being added

            // Check if the item already exists in the cart
            const existItem = state.cartItems.find((x) => x._id === item._id);

            if (existItem) {
                // If it exists, update its quantity
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? item : x
                );
            } else {
                // If it doesn't exist, add the new item
                state.cartItems = [...state.cartItems, item];
            }

            // Update totals and save to storage
            return updateCart(state);
        },

        removeItemFromCart: (state, action) => {
            const id = action.payload; // The id of the item to remove

            // Filter out the item with the matching id
            state.cartItems = state.cartItems.filter((item) => item._id !== id);

            // Update totals and save to storage
            return updateCart(state);
        },
        // New: Reducer to save the shipping address object
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            return updateCart(state);
        },

        // New: Reducer to save the chosen payment method string
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            return updateCart(state);
        },

        // Action to clear the cart entirely (used after successful order)
        clearCartItems: (state) => {
            state.cartItems = [];
            return updateCart(state);
        }
    },
});

// 4. Export Actions and Reducer
export const { addItemToCart, removeItemFromCart, saveShippingAddress, savePaymentMethod, clearCartItems } = cartSlice.actions;
export default cartSlice.reducer;