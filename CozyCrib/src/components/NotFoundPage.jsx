import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <FaExclamationTriangle className="text-yellow-400 text-6xl mb-4 animate-bounce" />
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-2">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link
        to="/home"
        className="px-6 py-3 bg-rose-500 text-white font-semibold rounded-lg shadow-md hover:bg-rose-600 transition-all duration-300 transform hover:scale-105"
      >
        Return to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage; 