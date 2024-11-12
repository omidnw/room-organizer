import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-surface border-t border-border py-4 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <Link to="/settings" className="text-textSecondary hover:text-primary transition-colors">
            Settings
          </Link>
          <span className="text-border">•</span>
          <Link to="/help" className="text-textSecondary hover:text-primary transition-colors">
            Help
          </Link>
          <span className="text-border">•</span>
          <Link to="/privacy" className="text-textSecondary hover:text-primary transition-colors">
            Privacy
          </Link>
        </div>
        
        <div className="text-textSecondary text-sm">
          <span>Home Inventory v1.0</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 