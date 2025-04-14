import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white bg-opacity-10 backdrop-blur-sm py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
          <div className="flex items-center text-white font-bold text-xl">
            Herd Game
          </div>
          <div className="flex space-x-4 text-white text-sm md:text-base">
            <Link to="/" className="hover:text-purple-200 transition-colors">Home</Link>
            <Link to="/blog" className="hover:text-purple-200 transition-colors">Blog</Link>
            <Link to="/faq" className="hover:text-purple-200 transition-colors">FAQ</Link>
            <Link to="/about-contact" className="hover:text-purple-200 transition-colors">About</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
