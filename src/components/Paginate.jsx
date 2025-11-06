// src/components/Paginate.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, keyword = '', isAdmin = false }) => {
  // Only render if there is more than one page
  if (pages <= 1) return null;

  return (
    <div className='flex justify-center my-8'>
      <div className='flex rounded-md shadow-sm -space-x-px'>
        {[...Array(pages).keys()].map((x) => (
          <Link
            key={x + 1}
            // Determine the navigation path
            to={
              !isAdmin
                ? keyword 
                    ? `/search/${keyword}/page/${x + 1}` // Search results pagination
                    : `/page/${x + 1}`                 // Homepage pagination
                : `/admin/productlist/page/${x + 1}`   // Admin screen pagination
            }
          >
            <button
              className={`
                relative inline-flex items-center px-4 py-2 border text-sm font-medium 
                ${x + 1 === page
                  ? 'bg-indigo-600 text-white border-indigo-600 z-10' // Active Page
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50' // Inactive Page
                }
              `}
              aria-current={x + 1 === page ? 'page' : undefined}
            >
              {x + 1}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Paginate;