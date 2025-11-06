// src/components/AdminRoute.jsx

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  // Get user info from Redux state
  const { userInfo } = useSelector((state) => state.user);

  // If user is logged in AND is an admin, allow access (render the children via Outlet)
  // Otherwise, navigate them to the login page
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace />
  );
};

export default AdminRoute;