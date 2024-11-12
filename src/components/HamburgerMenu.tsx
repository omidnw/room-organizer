import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-md focus:outline-none"
        onClick={toggleMenu}
      >
        <span className="sr-only">Open main menu</span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
          />
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-10"
          >
            <div className="p-4">
              <button
                className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-md focus:outline-none"
                onClick={toggleMenu}
              >
                <span className="sr-only">Close menu</span>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <nav className="mt-8 space-y-4">
                <a href="#" className="block px-4 py-2 text-lg font-medium text-gray-800 hover:bg-gray-100 rounded-md transition">
                  Home
                </a>
                <a href="#" className="block px-4 py-2 text-lg font-medium text-gray-800 hover:bg-gray-100 rounded-md transition">
                  About
                </a>
                <a href="#" className="block px-4 py-2 text-lg font-medium text-gray-800 hover:bg-gray-100 rounded-md transition">
                  Contact
                </a>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HamburgerMenu; 