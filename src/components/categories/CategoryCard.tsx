import React from 'react';
import { motion } from 'framer-motion';
import { Package, Folder, ChevronRight } from 'lucide-react';
import Card from '../ui/Card';
import { Category } from '../../types/inventory';

interface CategoryCardProps {
  category: Category;
  itemCount: number;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

function CategoryCard({ category, itemCount, onClick, showActions = false }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="h-full hover:border-primary transition-colors">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: category.color || 'var(--color-primary)' }}
            >
              {category.isFolder ? (
                <Folder className="w-6 h-6 text-white" />
              ) : (
                <Package className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex items-center text-sm text-textSecondary">
              <span>{itemCount} items</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          <div>
            <div className="flex items-center">
              {category.level > 0 && (
                <div 
                  className="h-6 border-l border-border mr-2"
                  style={{ marginLeft: `${(category.level - 1) * 12}px` }}
                />
              )}
              <h3 className="text-lg font-semibold text-textPrimary">
                {category.name}
              </h3>
            </div>
            
            {category.description && (
              <p className="text-sm text-textSecondary mt-1 ml-6">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default CategoryCard; 