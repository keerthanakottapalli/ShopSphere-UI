// src/screens/RegisterScreen.jsx (CORRECTED)

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { User, Mail, Lock, LogIn as RegisterIcon } from 'lucide-react';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/userSlice';

// Loader component used for the button's loading state
const Loader = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
);

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null); // Local message for password mismatch

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. RTK Query Hook
  // Note: RTK Query mutation hooks do NOT provide a direct `error` variable like queries do.
  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.user);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      // Using navigate(redirect) ensures the correct path is used
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]); // Include redirect in dependencies

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear local message

    if (password !== confirmPassword) {
      // Display password mismatch message locally
      setMessage('Passwords do not match');
      return;
    }

    try {
      // 2. RTK Query Call - handles network/API error in catch block
      const res = await register({ name, email, password }).unwrap();

      // 3. Dispatch Local Action
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      // API errors (400, 500 etc.) are handled here and displayed via toast
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-foreground text-center mb-6">Create Account</h1>

        {/* Display Password Mismatch Message */}
        {message && (
          <div className="bg-destructive/10 text-destructive border border-destructive rounded p-3 mb-4 text-center">
            {message}
          </div>
        )}

        {/* Removed the redundant 'error' block: API errors are handled by toast.error in the catch block */}

        <form onSubmit={submitHandler} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring/50 bg-background text-foreground"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring/50 bg-background text-foreground"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring/50 bg-background text-foreground"
                required
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring/50 bg-background text-foreground"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground 
            ${isLoading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 transition-colors'}`}
          >
            {isLoading ? (
              <Loader /> // <-- Use the defined Loader component here
            ) : (
              <><RegisterIcon className="h-5 w-5" /> <span>Register</span></>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : '/login'} // Added redirect logic for consistency
              className="text-primary hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;