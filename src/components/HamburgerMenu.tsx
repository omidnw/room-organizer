import React from 'react';
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

interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

const menuItems: MenuItem[] = [
  { 
    title: 'Home',
    href: '/',
    icon: Home,
    description: 'Dashboard overview'
  },
  { 
    title: 'Items',
    href: '/items',
    icon: Package,
    description: 'Browse your items'
  },
  { 
    title: 'Categories',
    href: '/categories',
    icon: Grid,
    description: 'Manage categories'
  },
  { 
    title: 'Reports',
    href: '/reports',
    icon: BarChart2,
    description: 'View reports'
  },
  { 
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Configure app settings'
  }
];

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  const renderMenuItem = (item: MenuItem) => (
    <Link 
      key={item.href} 
      to={item.href}
      onClick={onClose}
    >
      <motion.div
        whileHover={{ x: 4 }}
        className="flex items-center p-4 rounded-lg hover:bg-background text-textSecondary hover:text-primary transition-colors"
      >
        <item.icon className="w-5 h-5 mr-3" />
        <div>
          <p className="font-medium text-textPrimary">{item.title}</p>
          {item.description && (
            <p className="text-sm text-textSecondary">{item.description}</p>
          )}
        </div>
      </motion.div>
    </Link>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-y-0 right-0 w-80 bg-surface shadow-xl z-50 flex flex-col"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            {/* Menu Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-textPrimary">Menu</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-background text-textSecondary hover:text-primary transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto p-4 bg-surface">
              <div className="space-y-2">
                {menuItems.map(renderMenuItem)}
              </div>
            </nav>

            {/* Menu Footer */}
            <div className="p-4 border-t border-border bg-surface">
              <p className="text-sm text-center text-textSecondary">
                Room Organizer v1.0
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default HamburgerMenu;