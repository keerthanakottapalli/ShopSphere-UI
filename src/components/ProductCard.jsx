// src/components/ProductCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// This is a placeholder for a rating component. We'll keep it simple for now.
const Rating = ({ value, text }) => {
  const stars = [1, 2, 3, 4, 5].map((i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${value >= i ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
        }`}
    />
  ));

  return (
    <div className="flex items-center space-x-1">
      <div className="flex">{stars}</div>
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
};

const ProductCard = ({ product }) => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">

      {/* Product Image Link */}
      <Link to={`/product/${product._id}`}>
        <img
          src={`${BASE_URL}${product.image}`}
          alt={product.name}
          className="w-full h-48 object-cover object-center"
        />
      </Link>

      <div className="p-4 space-y-3">
        {/* Product Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <Rating
          value={product.rating} // e.g., 4.5
          text={`${product.numReviews} reviews`} // e.g., '12 reviews'
        />

        <div className="flex justify-between items-center pt-2">
          {/* Price */}
          <p className="text-2xl font-bold text-primary">
            ₹{product.price ? product.price.toFixed(2) : 'N/A'}
          </p>

          {/* Add to Cart Button */}
          <button
            // We will implement the actual add to cart logic later
            disabled={product.stock === 0}
            className={`flex items-center space-x-1 py-2 px-3 rounded-full text-sm font-medium transition-colors ${product.stock > 0
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">
              {product.stock > 0 ? 'Add' : 'Out of Stock'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;