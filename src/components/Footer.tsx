import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-surface border-t border-border py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-textSecondary">
            © {new Date().getFullYear()} Room Organizer. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/help" className="text-sm text-textSecondary hover:text-primary transition-colors">
              Help
            </Link>
            <Link to="/privacy" className="text-sm text-textSecondary hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link to="/settings" className="text-sm text-textSecondary hover:text-primary transition-colors">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 