// src/components/Header.jsx (Updated with Profile and Dropdown Fixes)

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/userSlice';
import {
    ShoppingCart,
    User,
    LogIn,
    LogOut,
    LayoutDashboard,
    Search,
    ChevronDown, // <-- Added for better visual cues
    ListOrdered
} from 'lucide-react';
import SearchBox from './SearchBox';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

    // Assuming cart items count is available in state.cart
    const { cartItems } = useSelector((state) => state.cart);
    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const { userInfo } = useSelector((state) => state.user);

    const isAuthenticated = !!userInfo;
    const isAdmin = userInfo && userInfo.isAdmin;

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login'); // Navigate to login page after logout
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50 border-b">
            <div className="container mx-auto p-4 flex justify-between items-center space-x-4">

                {/* 1. Logo / Brand */}
                <Link to="/" className="text-2xl font-extrabold text-indigo-600 tracking-tight hover:text-indigo-800 transition-colors">
                    ShopSphere
                </Link>

                <SearchBox />

                {/* 3. Navigation Links (Cart & User Menu) */}
                <nav className="flex items-center space-x-6">

                    {/* Cart Link with Count */}
                    <Link to="/cart" className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center space-x-1 relative" aria-label="Shopping Cart">
                        <ShoppingCart className="h-6 w-6" />
                        <span className="hidden sm:inline">Cart</span>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>


                    {isAuthenticated ? (
                        <div className="relative">
                            {/* Toggle Button */}
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center text-gray-700 hover:text-indigo-600 font-medium"
                            >
                                <User className="h-5 w-5 mr-1" />
                                <span className="hidden sm:inline">{userInfo.name.split(" ")[0]}</span>
                                <ChevronDown
                                    className={`h-4 w-4 ml-1 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {/* User Dropdown */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 animate-fadeIn">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                        <ListOrdered className="mr-2 h-4 w-4 text-indigo-600" /> My Profile
                                    </Link>

                                    {/* Admin Nested Menu */}
                                    {isAdmin && (
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                                                className="w-full flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <span className="flex items-center">
                                                    <LayoutDashboard className="mr-2 h-4 w-4 text-red-600" /> Admin
                                                </span>
                                                <ChevronDown
                                                    className={`h-4 w-4 transition-transform duration-200 ${isAdminMenuOpen ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </button>

                                            {/* Nested Admin Menu */}
                                            {isAdminMenuOpen && (
                                                <div
                                                    className="absolute right-full top-0 mr-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 animate-fadeIn"
                                                >
                                                    <Link
                                                        to="/admin/productlist"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                    >
                                                        <ListOrdered className="mr-2 h-4 w-4 text-indigo-600" /> Products
                                                    </Link>
                                                    <Link
                                                        to="/admin/orderlist"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center border-t border-gray-100"
                                                    >
                                                        <ListOrdered className="mr-2 h-4 w-4 text-indigo-600" /> Orders
                                                    </Link>
                                                    <Link
                                                        to="/admin/userlist"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center border-t border-gray-100"
                                                    >
                                                        <User className="mr-2 h-4 w-4 text-indigo-600" /> Users
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Logout */}
                                    <button
                                        onClick={logoutHandler}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center border-t border-gray-100"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                            <span className="flex items-center space-x-1">
                                <LogIn className="h-4 w-4" />
                                <span>Sign In</span>
                            </span>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;