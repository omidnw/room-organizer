import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Home,
  Package,
  Grid,
  BarChart2,
  Settings,
  Menu,
  X,
  LucideIcon 
} from 'lucide-react';

// Define menu item type for better type safety
interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

// Menu items configuration
const menuItems: MenuItem[] = [
  { 
    title: 'Home',
    href: '/',
    icon: Home,
    description: 'Dashboard overview'
  },
  { 
    title: 'Inventory',
    href: '/inventory',
    icon: Package,
    description: 'Manage your items'
  },
  { 
    title: 'Categories',
    href: '/categories',
    icon: Grid,
    description: 'Organize items by category'
  },
  { 
    title: 'Reports',
    href: '/reports',
    icon: BarChart2,
    description: 'View analytics and reports'
  },
  { 
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Customize your experience'
  },
];

function HamburgerMenu() {
  // State management
  const [isOpen, setIsOpen] = useState(false);

  // Event handlers
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Render menu item
  const renderMenuItem = (item: MenuItem) => (
    <motion.div key={item.title} whileHover={{ x: 4 }}>
      <Link
        to={item.href}
        onClick={toggleMenu}
        className="flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-colors hover:bg-background text-textPrimary hover:text-primary group"
        aria-label={item.description}
      >
        <item.icon className="w-5 h-5 mr-3 text-textSecondary group-hover:text-primary transition-colors" />
        {item.title}
      </Link>
    </motion.div>
  );

  return (
    <div className="relative">
      {/* Hamburger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-background text-textSecondary hover:text-primary transition-colors"
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      {/* Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={toggleMenu}
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ backgroundColor: 'var(--color-surface)' }}
              className="fixed top-0 right-0 w-72 h-screen shadow-xl z-50"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--color-surface)' }}>
                {/* Menu Header */}
                <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Menu</h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleMenu}
                      className="p-2 rounded-lg hover:bg-background text-textSecondary hover:text-primary transition-colors"
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 p-6" role="navigation">
                  <div className="space-y-2">
                    {menuItems.map(renderMenuItem)}
                  </div>
                </nav>

                {/* Menu Footer */}
                <div className="p-6 border-t" style={{ 
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-surface)'
                }}>
                  <p className="text-sm text-center text-textSecondary">
                    Home Inventory v1.0
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HamburgerMenu;