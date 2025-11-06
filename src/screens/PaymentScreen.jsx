// src/screens/PaymentScreen.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice'; // <-- Import save action
import { CreditCard, Banknote, ChevronsRight } from 'lucide-react';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod: savedPaymentMethod } = cart;

  // 1. Check for Shipping Address
  // If the shipping address is missing, redirect the user back to the shipping step.
  useEffect(() => {
    if (!shippingAddress || Object.keys(shippingAddress).length === 0) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  // 2. Local state for selected payment method (defaults to saved method or 'PayPal')
  const [paymentMethod, setPaymentMethod] = useState(savedPaymentMethod || 'PayPal');

  const submitHandler = (e) => {
    e.preventDefault();
    
    // Dispatch the action to save the chosen payment method
    dispatch(savePaymentMethod(paymentMethod));
    
    // Navigate to the next step: Place Order
    navigate('/placeorder');
  };

  return (
    <div className="flex flex-col items-center py-10">
      <div className="w-full max-w-xl">
        {/* Highlight Sign In, Shipping, and Payment */}
        <CheckoutSteps step1 step2 step3 /> 
        
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-foreground text-center mb-6">Payment Method</h1>

          <form onSubmit={submitHandler} className="space-y-6">
            <p className="text-muted-foreground mb-4">Select your preferred payment method:</p>
            
            {/* Payment Options Group */}
            <div className="space-y-4">
              
              {/* Option 1: PayPal */}
              <div className="flex items-center border border-border p-4 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                <input
                  id="PayPal"
                  name="paymentMethod"
                  type="radio"
                  value="PayPal"
                  checked={paymentMethod === 'PayPal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-5 w-5 text-primary focus:ring-primary border-border mr-4"
                />
                <label htmlFor="PayPal" className="flex items-center font-medium text-foreground flex-grow">
                  <Banknote className="h-5 w-5 mr-3 text-green-600" />
                  PayPal or Credit/Debit Card
                </label>
              </div>

              {/* Option 2: Stripe (Future expansion, kept simple for now) */}
              <div className="flex items-center border border-border p-4 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                <input
                  id="Stripe"
                  name="paymentMethod"
                  type="radio"
                  value="Stripe"
                  checked={paymentMethod === 'Stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-5 w-5 text-primary focus:ring-primary border-border mr-4"
                />
                <label htmlFor="Stripe" className="flex items-center font-medium text-foreground flex-grow">
                  <CreditCard className="h-5 w-5 mr-3 text-indigo-600" />
                  Credit Card (via Stripe)
                </label>
              </div>
              
              {/* Note: We can add 'Cash on Delivery' or other options here later */}

            </div>

            {/* Continue Button */}
            <button
              type="submit"
              className="w-full flex justify-center items-center space-x-2 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors mt-6"
            >
              <ChevronsRight className="h-5 w-5" /> <span>Continue to Place Order</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;