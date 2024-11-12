import React from 'react';
import { Search, Filter } from 'lucide-react';

interface ItemFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories: { id: string; name: string }[];
}

function ItemFilters({ search, onSearchChange, category, onCategoryChange, categories }: ItemFiltersProps) {
  return (
    <div className="bg-surface p-4 rounded-lg shadow-sm border border-border">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-grow">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-textPrimary placeholder:text-textSecondary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="text-textSecondary w-5 h-5" />
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-textPrimary focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default ItemFilters; 