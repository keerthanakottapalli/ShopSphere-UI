// src/screens/LoginScreen.jsx (Updated to match RegisterScreen styling)

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Mail, Shield, LogIn as LoginIcon } from 'lucide-react'; // Renamed LogIn to LoginIcon

import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/userSlice';

// Loader component styled for the button
const Loader = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
);


const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();
    const { userInfo } = useSelector((state) => state.user);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, navigate, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="flex justify-center items-center py-10">
            {/* MATCHING CARD STYLING */}
            <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-foreground text-center mb-6">
                    <LoginIcon className="h-6 w-6 mr-3 text-primary inline-block" /> Sign In
                </h1>

                {/* NOTE: We removed the error display here as toast.error handles it */}

                <form onSubmit={submitHandler} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                id="email" type="email" placeholder="Enter email" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring/50 bg-background text-foreground"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">Password</label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                id="password" type="password" placeholder="Enter password" value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring/50 bg-background text-foreground"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button (MATCHING STYLING) */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center items-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground 
                            ${isLoading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 transition-colors'}`}
                    >
                        {isLoading ? (
                            <Loader />
                        ) : (
                            <><LoginIcon className="h-5 w-5" /> <span>Sign In</span></>
                        )}
                    </button>
                </form>

                {/* Login Link (MATCHING STYLING) */}
                <div className="mt-6 text-center text-sm">
                    <p className="text-muted-foreground">
                        New Customer?{' '}
                        <Link
                            to={redirect ? `/register?redirect=${redirect}` : '/register'}
                            className="text-primary hover:underline font-medium"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;