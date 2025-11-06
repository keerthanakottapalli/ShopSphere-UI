// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  // Check user login status from Redux
  const { userInfo } = useSelector((state) => state.user);
  
  // If user is logged in, render the child route component (<Outlet />).
  // If not, redirect them to the login page.
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};

export default ProtectedRoute;