// src/slices/userSlice.js (CLEANED - Local State Management ONLY)

import { createSlice } from '@reduxjs/toolkit';

// 1. Initial State: Load userInfo from local storage
const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

const initialState = {
    userInfo: userInfoFromStorage,
};

// 2. Create the User Slice (ONLY Reducers for local state changes)
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Sets the user credentials (used after Login, Register, or Profile Update)
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        
        // Clears the user info (used after Logout)
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },
    },
});

// 3. Export Actions and Reducer
export const { setCredentials, logout } = userSlice.actions;
export default userSlice.reducer;