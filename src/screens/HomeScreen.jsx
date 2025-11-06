// src/screens/HomeScreen.jsx (Updated for Search Functionality)

import React from 'react';
import { useGetProductsQuery } from '../slices/productApiSlice';
import { useParams, Link } from 'react-router-dom'; // <-- Added Link for navigation
import ProductCard from '../components/ProductCard';
import { ArrowLeft } from 'lucide-react'; // <-- Added icon for visual appeal
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';

// Custom components for professional feedback (Keeping your existing Loader and Message)
const Loader = () => (
  <div className="flex justify-center items-center py-10">
    {/* Simple Tailwind Spinner */}
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    <p className="ml-4 text-indigo-600">Loading Products...</p>
  </div>
);

const Message = ({ variant = 'info', children }) => {
  const baseClasses = 'p-4 rounded-md text-center';
  let colorClasses = '';

  switch (variant) {
    case 'danger':
      colorClasses = 'bg-red-100/30 text-red-700 border border-red-300';
      break;
    case 'info':
    default:
      colorClasses = 'bg-blue-100/30 text-blue-700 border border-blue-300';
      break;
  }

  return <div className={`${baseClasses} ${colorClasses} max-w-lg mx-auto mt-8`}>{children}</div>;
};


const HomeScreen = () => {
  // Get the keyword from the URL. It will be undefined if we are on the base route '/'.
  const { keyword, pageNumber } = useParams();

  // 1. Use the RTK Query hook, passing the keyword (it will be passed as '' if undefined)
  const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNumber });

  // Safely access the products array
  const products = data?.products || [];
  const page = data?.page;
  const pages = data?.pages;

  // Determine the title based on the presence of a keyword
  const pageTitle = keyword
    ? `Search Results for: "${keyword}"`
    : 'Latest Products';

  // --- Content Render ---

  return (
    <div className="py-8">
      {!keyword && <ProductCarousel />}
      {/* 2. Dynamic Heading */}
      <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight text-center mb-10">
        {pageTitle}
      </h1>

      {/* 3. Show "Go Back" button only if a search is active */}
      {keyword && (
        <Link to='/' className="text-indigo-600 hover:text-indigo-800 flex items-center w-max mb-6">
          <ArrowLeft className="w-5 h-5 mr-1" />
          Go Back to All Products
        </Link>
      )}

      {/* 4. Handle Loading State */}
      {isLoading ? (
        <Loader />
      ) :

        /* 5. Handle Error State */
        error ? (
          <Message variant="danger">
            Error fetching products: {error?.data?.message || error.error}
          </Message>
        ) :

          /* 6. Handle No Results State */
          products.length === 0 && keyword ? (
            <Message variant="info">
              😔 Sorry, no products matched your search for **"{keyword}"**. Please try a different term.
            </Message>
          ) :

            /* 7. Handle Success State (Display Products) */
            (
              <>
                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* 3. Render Pagination Component */}
                <Paginate
                  pages={pages}
                  page={page}
                  keyword={keyword ? keyword : ''}
                />
              </>
            )}
    </div>
  );
};

export default HomeScreen;