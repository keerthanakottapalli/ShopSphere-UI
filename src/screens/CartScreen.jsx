// src/screens/CartScreen.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash, ShoppingCart, ArrowLeft } from 'lucide-react';
import { addItemToCart, removeItemFromCart } from '../slices/cartSlice';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Reusing the Message component for an empty cart message
const Message = ({ children }) => {
  const classes = 'p-4 rounded-md text-center bg-secondary/50 text-secondary-foreground border border-border mt-4';
  return <div className={classes}>{children}</div>;
};

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get cart state from Redux store
  const cart = useSelector((state) => state.cart);
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = cart;

  // Handler to update quantity or add item (re-uses existing action)
  const addToCartHandler = async (product, qty) => {
    dispatch(addItemToCart({ ...product, qty }));
  };

  // Handler to remove item completely
  const removeFromCartHandler = async (id) => {
    dispatch(removeItemFromCart(id));
  };
  
  // Handler for Checkout button
  const checkoutHandler = () => {
    // Navigate to the login page first. If already logged in, the login screen redirects to shipping.
    // We will update this to navigate to a dedicated shipping screen later.
    navigate('/login?redirect=/shipping'); 
  };

  return (
    <div className="py-6">
      <Link to="/" className="text-primary hover:underline flex items-center mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping
      </Link>

      <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <Message>
          Your cart is empty. <Link to="/" className="text-primary hover:underline font-medium">Go Back</Link>
        </Message>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Cart Items List (2/3 width on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center border border-border rounded-lg p-4 bg-card shadow-sm">
                
                {/* Image */}
                <div className="w-16 h-16 mr-4 flex-shrink-0">
                  <img src={`${BASE_URL}${item.image}`} alt={item.name} className="w-full h-full object-cover rounded" />
                </div>
                
                {/* Product Name */}
                <div className="flex-grow">
                  <Link to={`/product/${item._id}`} className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="text-muted-foreground text-sm">₹{item.price.toFixed(2)}</p>
                </div>

                {/* Quantity Selector */}
                <div className="mx-4 flex-shrink-0">
                  <select
                    value={item.qty}
                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                    className="p-2 border border-border rounded-md bg-background text-foreground"
                  >
                    {[...Array(item.stock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCartHandler(item._id)}
                  className="p-2 ml-4 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Column 2: Order Summary (1/3 width on large screens) */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg p-6 bg-card shadow-xl sticky top-20">
              <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-3">
                Order Summary
              </h2>
              
              {/* Item Count */}
              <p className="mb-4 text-lg text-foreground">
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}{' '}
                {cartItems.reduce((acc, item) => acc + item.qty, 0) === 1 ? 'item' : 'items'}):
              </p>
              
              {/* Price Breakdown */}
              <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                      <span>Items Price:</span>
                      <span className='font-medium'>₹{itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                      <span>Shipping:</span>
                      <span className='font-medium'>₹{shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                      <span>Tax (2%):</span>
                      <span className='font-medium'>₹{taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border/50 text-xl font-bold text-primary">
                      <span>Total:</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                className={`w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-lg text-lg font-bold transition-colors ${
                  cartItems.length > 0 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Proceed To Checkout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;