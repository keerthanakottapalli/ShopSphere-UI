// src/components/Footer.jsx

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8 border-t border-gray-700">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        <p className="text-center md:text-left mb-2 md:mb-0">
          &copy; {new Date().getFullYear()} ShopSphere. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <a href="/about" className="hover:text-primary transition-colors">About Us</a>
          <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
          <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;