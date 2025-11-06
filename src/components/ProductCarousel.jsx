// src/components/ProductCarousel.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useGetTopProductsQuery } from '../slices/productApiSlice';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Placeholder components (assume Loader and Message are imported or defined here)
const Loader = () => <div>Loading Top Products...</div>;
const Message = ({ children }) => <div className="text-red-600">{children}</div>;

const ProductCarousel = () => {
    const { data: products, isLoading, error } = useGetTopProductsQuery();

    if (isLoading) return <Loader />;
    if (error) return <Message>Failed to load top products.</Message>;

    // Simple display logic (replace this with a proper carousel/swiper library later)
    return (
        <div className="bg-gray-100 p-6 mb-10 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">⭐ Top Rated Products</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <Link 
                        key={product._id} 
                        to={`/product/${product._id}`} 
                        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <img 
                            src={`${BASE_URL}${product.image}`}
                            alt={product.name} 
                            className="w-full h-40 object-cover rounded-md mb-3" 
                        />
                        <div className="font-semibold text-lg text-indigo-600 truncate">{product.name}</div>
                        <div className="text-sm text-gray-500">Rating: {product.rating.toFixed(1)} / 5</div>
                        <div className="text-xl font-bold text-gray-900">₹{product.price.toFixed(2)}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProductCarousel;