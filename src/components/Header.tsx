import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HamburgerMenu from './HamburgerMenu';

function Header() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-surface/80 backdrop-blur-md border-b border-border text-textPrimary p-4 flex justify-between items-center shadow-sm fixed w-full top-0 z-30"
    >
      <Link to="/">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-3"
        >
          <div className="bg-primary p-2 rounded-lg">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-textPrimary leading-tight">
              Home Inventory
            </h1>
            <span className="text-xs text-textSecondary">
              Manage your items
            </span>
          </div>
        </motion.div>
      </Link>

      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg hover:bg-background text-textSecondary hover:text-primary transition-colors hidden md:flex"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </motion.button>
        <HamburgerMenu />
      </div>
    </motion.header>
  );
}

export default Header; 