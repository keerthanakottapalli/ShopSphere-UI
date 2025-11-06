// src/screens/ProductScreen.jsx

import React, { useState } from 'react';
import { useParams, Link, useNavigate, data } from 'react-router-dom';
import { useGetProductDetailsQuery } from '../slices/productApiSlice';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../slices/cartSlice';
import { ArrowLeft, Star, ShoppingCart } from 'lucide-react';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Reusing the message component for error and info display
const Message = ({ variant = 'info', children }) => {
    const baseClasses = 'p-4 rounded-md text-center';
    let colorClasses = '';

    switch (variant) {
        case 'danger':
            colorClasses = 'bg-destructive/10 text-destructive border border-destructive';
            break;
        case 'info':
        default:
            colorClasses = 'bg-secondary/50 text-secondary-foreground border border-border';
            break;
    }
    return <div className={`${baseClasses} ${colorClasses} mt-4`}>{children}</div>;
};

// Reusing the loader component
const Loader = () => (
    <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="ml-4 text-primary">Loading Product Details...</p>
    </div>
);

// Simple rating display for this screen
const ProductRating = ({ value, text }) => (
    <div className="flex items-center space-x-2">
        <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`h-5 w-5 ${value >= i ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
            ))}
        </div>
        <span className="text-lg text-muted-foreground">({text})</span>
    </div>
);

const ProductScreen = () => {
    // 1. Get the product ID from the URL
    const { id: productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 2. Fetch the product details using RTK Query
    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

    // State for quantity selection
    const [qty, setQty] = useState(1);

    // Functionality to add to cart (will be implemented fully with the cart slice later)
    const addToCartHandler = () => {
        // Dispatch the addItemToCart action with the product details and selected quantity
        dispatch(
            addItemToCart({
                _id: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                stock: product.stock,
                qty, // the quantity selected by the user
            })
        );
        // After adding, navigate the user to the cart page
        navigate('/cart');
    };

    return (
        <div className="py-6">
            <Link to="/" className="text-primary hover:underline flex items-center mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
            </Link>

            {/* 3. Handle Loading and Error States */}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    Error: {error?.data?.message || error.error}
                </Message>
            ) : (
                /* 4. Display Product Details */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-card p-6 rounded-lg shadow-xl border border-border">

                    {/* Column 1: Image */}
                    <div className="lg:col-span-1">
                        <img
                            src={`${BASE_URL}${product.image}`}
                            alt={product.name}
                            className="w-full h-auto rounded-lg object-cover"
                        />
                    </div>

                    {/* Column 2: Info & Description */}
                    <div className="lg:col-span-1 border-b lg:border-r lg:border-b-0 border-border pb-4 lg:pr-6 space-y-4">
                        <h1 className="text-4xl font-extrabold text-foreground">{product.name}</h1>

                        <p className="text-xl font-semibold text-primary">₹{product.price.toFixed(2)}</p>

                        <ProductRating value={product.rating} text={`${product.numReviews} Reviews`} />

                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-foreground mt-4">Description:</h2>
                            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                        </div>
                    </div>

                    {/* Column 3: Status & Add to Cart Panel */}
                    <div className="lg:col-span-1">
                        <div className="border border-border rounded-lg p-5 shadow-inner space-y-4">

                            {/* Status */}
                            <div className="flex justify-between items-center pb-2 border-b border-border">
                                <span className="text-lg font-medium text-foreground">Status:</span>
                                <span className={`text-lg font-bold ${product.stock > 0 ? 'text-green-600' : 'text-destructive'
                                    }`}>
                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex justify-between items-center pb-2 border-b border-border">
                                <span className="text-lg font-medium text-foreground">Price:</span>
                                <span className="text-xl font-bold text-primary">₹{product.price.toFixed(2)}</span>
                            </div>

                            {/* Quantity Selector (if in stock) */}
                            {product.stock > 0 && (
                                <div className="flex justify-between items-center pb-2 border-b border-border">
                                    <span className="text-lg font-medium text-foreground">Qty:</span>
                                    <select
                                        value={qty}
                                        onChange={(e) => setQty(Number(e.target.value))}
                                        className="p-2 border border-border rounded-md bg-background"
                                    >
                                        {[...Array(product.stock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Add to Cart Button */}
                            <button
                                onClick={addToCartHandler}
                                disabled={product.stock === 0}
                                className={`w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-lg text-lg font-bold transition-colors ${product.stock > 0
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                                    }`}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                <span>Add To Cart</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductScreen;