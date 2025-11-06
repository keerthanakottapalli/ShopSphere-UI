// src/components/SearchBox.jsx

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBox = () => {
  const navigate = useNavigate();
  // Get the keyword from the URL if it already exists
  const { keyword: urlKeyword } = useParams();

  // Initialize state with the URL keyword or an empty string
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    
    // 1. Trim whitespace and convert to lowercase
    const trimmedKeyword = keyword.trim().toLowerCase();

    if (trimmedKeyword) {
      // 2. Navigate to the search results page
      // This path must match the route defined in your App.js/Router setup (e.g., /search/:keyword)
      navigate(`/search/${trimmedKeyword}`);
      
      // Optional: Clear the input after search (if you prefer, otherwise keep it)
      // setKeyword(''); 
    } else {
      // 3. If the user clears the box and hits search, navigate back to the home page
      navigate('/');
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex items-center">
      <input
        type="text"
        name="q"
        placeholder="Search Products..."
        className="py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out w-64 text-sm"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button 
        type="submit" 
        className="bg-indigo-600 text-white py-2 px-4 rounded-r-md hover:bg-indigo-700 transition duration-150 ease-in-out"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
};

export default SearchBox;