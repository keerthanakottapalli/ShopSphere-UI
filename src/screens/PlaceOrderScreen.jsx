// src/screens/PlaceOrderScreen.jsx

import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Box, CreditCard, Home, ShoppingCart, Truck } from 'lucide-react';

import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice'; // Action to clear cart after successful order
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

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
    case 'info':
    default:
      colorClasses = 'bg-blue-100 text-blue-700 border border-blue-300';
      break;
  }
  return <div className={`${baseClasses} ${colorClasses} my-4`}>{children}</div>;
};


const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  console.log(cart, "cart")

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    // If shipping or payment info is missing, redirect the user
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.shippingAddress.address, cart.paymentMethod, navigate]);


  const placeOrderHandler = async () => {
    try {
      // 1. Call the RTK Query mutation to create the order
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap(); // Use unwrap() to access the result or throw an error

      // 2. Clear the local cart state
      dispatch(clearCartItems());

      // 3. Redirect to the newly created order's details page
      navigate(`/order/${res._id}`);

    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };


  return (
    <div className="py-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center">
        <Box className="h-8 w-8 mr-3 text-indigo-600" /> Place Order
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Order Review (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">

          {/* 1. SHIPPING DETAILS */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-3 text-indigo-600" /> Shipping
            </h2>
            <p className="text-gray-600">
              {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>

          {/* 2. PAYMENT METHOD */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-3 text-indigo-600" /> Payment Method
            </h2>
            <p className="text-gray-600 font-medium">{cart.paymentMethod}</p>
          </div>

          {/* 3. ORDER ITEMS */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-3 text-indigo-600" /> Order Items
            </h2>

            {cart.cartItems.length === 0 ? (
              <Message>Your cart is empty. <Link to="/" className="text-indigo-600 hover:underline">Go shopping</Link>.</Message>
            ) : (
              <div className="space-y-4">
                {cart.cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center pb-4 border-b last:border-b-0 last:pb-0">
                    <div className="flex items-center space-x-4">
                      <img
                          src={`${BASE_URL}${item.image}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md border"
                        /> 
                      <Link
                        to={`/product/${item.product}`}
                        className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-gray-700">
                      {item.qty} x ₹{item.price.toFixed(2)} = <span className="font-bold">₹{(item.qty * item.price).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary and Place Order Button (1/3 width) */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md sticky top-24">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>

            {/* Price Breakdown */}
            <div className="space-y-4 text-gray-700 border-b pb-4 mb-4">
              <div className="flex justify-between"><span>Items:</span><span className="font-medium">₹{cart.itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping:</span><span className="font-medium">₹{cart.shippingPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax:</span><span className="font-medium">₹{cart.taxPrice.toFixed(2)}</span></div>
            </div>

            {/* Total */}
            <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
              <span>Total:</span>
              <span>₹{cart.totalPrice.toFixed(2)}</span>
            </div>

            {/* Error Message */}
            {error && (
              <Message variant="danger" className="mt-4">{error?.data?.message || error.error}</Message>
            )}

            {/* Place Order Button */}
            <button
              type="button"
              disabled={cart.cartItems.length === 0 || isLoading}
              onClick={placeOrderHandler}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-md text-base font-medium transition-colors ${cart.cartItems.length === 0 || isLoading
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
            >
              {isLoading ? <Loader /> : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;