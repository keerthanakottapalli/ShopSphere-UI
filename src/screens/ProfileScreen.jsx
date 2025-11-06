// src/screens/ProfileScreen.jsx (UPDATED for RTK Query CONSISTENCY)

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { LogIn, Mail, User, Shield, ListOrdered, Calendar } from 'lucide-react';
import { setCredentials } from '../slices/userSlice'; // Local reducer action
import { useUpdateUserProfileMutation } from '../slices/usersApiSlice'; // <-- RTK Query Hook
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';     // <-- RTK Query Hook

// Reusing Loader and Message components
const Loader = () => (
  <div className="flex justify-center items-center py-5">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div>
);

const Message = ({ variant = 'info', children }) => {
  const baseClasses = 'p-3 rounded-md text-sm';
  let colorClasses = '';
  switch (variant) {
    case 'danger':
      colorClasses = 'bg-red-100 text-red-700 border border-red-300';
      break;
    case 'success':
      colorClasses = 'bg-green-100 text-green-700 border border-green-300';
      break;
    case 'info':
    default:
      colorClasses = 'bg-blue-100 text-blue-700 border border-blue-300';
      break;
  }
  return <div className={`${baseClasses} ${colorClasses} my-4`}>{children}</div>;
};

const ProfileScreen = () => {
  const dispatch = useDispatch();
  
  // 1. Get user info from Redux
  const { userInfo } = useSelector((state) => state.user);
  
  // 2. Local State for Form
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 3. RTK Query Hooks
  // useUpdateUserProfileMutation: For profile update
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  // useGetMyOrdersQuery: For fetching orders list
  const { data: orders, isLoading: isOrdersLoading, error: ordersError } = useGetMyOrdersQuery();

  // 4. Form Submission Handler (Uses RTK Query mutation)
  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      // RTK Query Mutation Call (using .unwrap() to handle success/error promises)
      const res = await updateProfile({
        _id: userInfo._id,
        name,
        email,
        password,
      }).unwrap();

      // Update user info in local storage and Redux store with the new details
      dispatch(setCredentials({ ...res })); 
      toast.success('Profile updated successfully!');
      
      // Clear password fields for security after successful update
      setPassword('');
      setConfirmPassword('');

    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Column 1: Profile Update Form (1/3 width) */}
      <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg p-6 shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <User className="h-6 w-6 mr-3 text-indigo-600" /> User Profile
        </h1>
        
        <form onSubmit={submitHandler} className="space-y-5">
          
          {/* ... (Form fields remain the same) ... */}
          
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="name" type="text" placeholder="Enter name" value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="email" type="email" placeholder="Enter email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="password" type="password" placeholder="Enter new password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="confirmPassword" type="password" placeholder="Confirm new password" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Update Button */}
          <button
            type="submit"
            disabled={isUpdating}
            className={`w-full flex justify-center items-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isUpdating
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isUpdating ? <Loader /> : (
              <>
                <LogIn className="h-4 w-4 mr-2" /> <span>Update Profile</span>
              </>
            )}
          </button>
        </form>
      </div>

      
      {/* Column 2: User Order List (2/3 width) */}
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <ListOrdered className="h-6 w-6 mr-3 text-indigo-600" /> My Orders
        </h2>

        {isOrdersLoading ? (
          <Loader />
        ) : ordersError ? (
          <Message variant='danger'>
            {ordersError?.data?.message || ordersError.error}
          </Message>
        ) : (
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DELIVERED</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order._id.substring(18)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.isPaid ? (
                        <span className="text-green-600 font-semibold">
                           {new Date(order.paidAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Not Paid
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.isDelivered ? (
                        <span className="text-green-600 font-semibold">
                           {new Date(order.deliveredAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Not Delivered
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/order/${order._id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;