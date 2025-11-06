// src/screens/OrderScreen.jsx

import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { DollarSign, Truck, Calendar, ShoppingCart, Home } from 'lucide-react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery } from '../slices/ordersApiSlice';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Reusing Loader and Message components (for consistency)
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


const OrderScreen = () => {
  // Get the order ID from the URL path
  const { id: orderId } = useParams();

  // 1. RTK Query Hooks
  const {
    data: order,
    isLoading,
    error,
    refetch, // We'll use this to refresh the page after payment
  } = useGetOrderDetailsQuery(orderId);

  console.log(order, "order")

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery();

  // 2. PayPal Script Reducer (Manages the PayPal script loading state)
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const { userInfo } = useSelector((state) => state.user);

  // 3. Effect Hook to load PayPal script
  useEffect(() => {
    // Only load script if we have the order, it's not paid, and we successfully fetched the client ID
    if (!errorPayPal && !loadingPayPal && paypal) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId, // Use the client ID fetched from the backend
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) { // Check if the global script is not already loaded
          loadPayPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, paypal, order, paypalDispatch]);
  // 4. PayPal Success Handler
  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        // Call the RTK Query mutation to update the order status on the backend
        await payOrder({ orderId, details }).unwrap();
        refetch(); // Refresh the order details
        toast.success('Payment successful!');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  };

  // 5. PayPal Error/Cancel Handlers
  const onError = (err) => {
    toast.error(err.message);
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order.totalPrice, // Use the total price from the order
          },
        },
      ],
    }).then((orderID) => {
      return orderID;
    });
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <div className="py-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center">
        Order <span className="text-indigo-600 ml-2">#{order._id.slice(-8)}</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Shipping, Payment, and Order Items (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">

          {/* 1. SHIPPING DETAILS */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-3 text-indigo-600" /> Shipping
            </h2>
            <p className="text-gray-600 mb-2">
              <span className="font-medium text-gray-700">Name:</span> {order.user.name}
            </p>
            <p className="text-gray-600 mb-4">
              <span className="font-medium text-gray-700">Email:</span>
              <a href={`mailto:${order.user.email}`} className="text-indigo-600 hover:underline ml-1">
                {order.user.email}
              </a>
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-gray-700">Address:</span>
              {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>

            <div className={`mt-4 p-3 rounded-lg font-medium text-sm ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
              {order.isDelivered ? (
                <>Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</>
              ) : (
                <>Not Delivered</>
              )}
            </div>
          </div>

          {/* 2. PAYMENT METHOD */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-3 text-indigo-600" /> Payment Method
            </h2>
            <p className="text-gray-600">
              <span className="font-medium text-gray-700">Method:</span> {order.paymentMethod}
            </p>

            <div className={`mt-4 p-3 rounded-lg font-medium text-sm ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
              {order.isPaid ? (
                <>Paid on {new Date(order.paidAt).toLocaleDateString()}</>
              ) : (
                <>Not Paid</>
              )}
            </div>
          </div>

          {/* 3. ORDER ITEMS */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-3 text-indigo-600" /> Order Items
            </h2>

            {order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
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

        {/* RIGHT COLUMN: Order Summary and Payment/Admin Actions (1/3 width) */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md sticky top-24">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>

            <div className="space-y-4 text-gray-700 border-b pb-4 mb-4">
              <div className="flex justify-between">
                <span>Items Price:</span>
                {/* FIX: Use logical OR (|| 0) to ensure a number exists before .toFixed(2) */}
                <span className="font-medium">
                  ₹{(order.itemsPrice || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-medium">
                  ₹{(order.shippingPrice || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span className="font-medium">
                  ₹{(order.taxPrice || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Don't forget the totalPrice line below it! */}
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total:</span>
              <span>
                ₹{(order.totalPrice || 0).toFixed(2)}
              </span>
            </div>

            {/* Payment Button Placeholder (PayPal integration goes here later) */}
            {!order.isPaid && (
              <div className="mt-6">
                {loadingPay && <Loader />}

                {isPending || loadingPayPal ? (
                  <Loader />
                ) : errorPayPal ? (
                  <Message variant="danger">Error loading PayPal script.</Message>
                ) : (
                  <div>
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    />
                  </div>
                )}

              </div>
            )}
            {/* Admin/Deliver Button Placeholder (for later Admin module) */}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                className="w-full mt-4 bg-green-600 text-white py-2 rounded-md font-medium text-lg hover:bg-green-700 transition-colors"
              >
                Mark As Delivered
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;