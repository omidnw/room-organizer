import React from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Bell } from 'lucide-react';

interface ThemePreviewProps {
  theme: string;
}

function ThemePreview({ theme }: ThemePreviewProps) {
  return (
    <div className={`theme-${theme} rounded-lg overflow-hidden border border-border`}>
      {/* Header Preview */}
      <div className="bg-surface border-b border-border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-error" />
            <div className="w-3 h-3 rounded-full bg-warning" />
            <div className="w-3 h-3 rounded-full bg-success" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-primary/20" />
            <div className="w-4 h-4 rounded-full bg-primary/20" />
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="bg-background p-3 space-y-3">
        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-surface rounded-md p-1.5 flex items-center space-x-2">
            <Search className="w-3 h-3 text-textSecondary" />
            <div className="h-2 w-24 bg-border/50 rounded" />
          </div>
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Bell className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-2">
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              className="bg-surface rounded-md p-2 space-y-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                  <Package className="w-3 h-3 text-primary" />
                </div>
                <div className="h-2 w-12 bg-textSecondary/20 rounded" />
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-textSecondary/10 rounded" />
                <div className="h-1.5 w-2/3 bg-textSecondary/10 rounded" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-primary/20" />
            <div className="w-4 h-4 rounded bg-primary/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemePreview; 