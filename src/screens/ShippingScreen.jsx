// src/screens/ShippingScreen.jsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice'; // <-- Import save action
import CheckoutSteps from '../components/CheckoutSteps';
import { MapPin, Phone, Home, Globe } from 'lucide-react';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // Initialize state from existing address (or empty string)
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    
    // Dispatch the action to save the shipping address
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    
    // Navigate to the next step: Payment
    navigate('/payment');
  };

  return (
    <div className="flex flex-col items-center py-10">
      <div className="w-full max-w-xl">
        <CheckoutSteps step1 step2 /> {/* Highlight 'Sign In' and 'Shipping' */}
        
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-foreground text-center mb-6">Shipping Address</h1>

          <form onSubmit={submitHandler} className="space-y-6">
            
            {/* Address Field */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-foreground mb-1">Address</label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="address" type="text" placeholder="Street Address" value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring/50 bg-background text-foreground"
                  required
                />
              </div>
            </div>

            {/* City Field */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-foreground mb-1">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="city" type="text" placeholder="City" value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring/50 bg-background text-foreground"
                  required
                />
              </div>
            </div>

            {/* Postal Code Field */}
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-foreground mb-1">Postal Code</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="postalCode" type="text" placeholder="Postal Code" value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring/50 bg-background text-foreground"
                  required
                />
              </div>
            </div>
            
            {/* Country Field */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-foreground mb-1">Country</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="country" type="text" placeholder="Country" value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring/50 bg-background text-foreground"
                  required
                />
              </div>
            </div>


            {/* Continue Button */}
            <button
              type="submit"
              className="w-full flex justify-center items-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShippingScreen;