import React from "react";
import { Search } from "lucide-react";

interface CategoryFiltersProps {
	search: string;
	onSearchChange: (value: string) => void;
}

function CategoryFilters({ search, onSearchChange }: CategoryFiltersProps) {
	return (
		<div className="bg-surface p-4 rounded-lg shadow-sm border border-border">
			<div className="flex items-center">
				{/* Search Input */}
				<div className="flex-grow">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary w-5 h-5" />
						<input
							type="text"
							placeholder="Search categories..."
							value={search}
							onChange={(e) => onSearchChange(e.target.value)}
							className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-textPrimary placeholder:text-textSecondary focus:outline-none focus:border-primary transition-colors"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CategoryFilters;
