import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Category } from '../../types/inventory';

interface CategoryBreadcrumbProps {
  category?: Category;
  categoryPath: Category[];
}

function CategoryBreadcrumb({ category, categoryPath }: CategoryBreadcrumbProps) {
  return (
    <div className="flex items-center space-x-2 text-sm">
      <Link 
        to="/items"
        className="flex items-center text-textSecondary hover:text-primary transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {categoryPath.map((cat, index) => (
        <React.Fragment key={cat.id}>
          <ChevronRight className="w-4 h-4 text-textSecondary" />
          <Link
            to={`/items?category=${cat.id}`}
            className="text-textSecondary hover:text-primary transition-colors"
          >
            {cat.name}
          </Link>
        </React.Fragment>
      ))}

      {category && (
        <>
          <ChevronRight className="w-4 h-4 text-textSecondary" />
          <span className="text-textPrimary font-medium">
            {category.name}
          </span>
        </>
      )}
    </div>
  );
}

export default CategoryBreadcrumb; 