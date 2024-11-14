import React from "react";
import { Search } from "lucide-react";

interface ItemFiltersProps {
	search: string;
	onSearchChange: (value: string) => void;
	searchType: "all" | "categories" | "items";
	onSearchTypeChange: (value: "all" | "categories" | "items") => void;
}

function ItemFilters({ search, onSearchChange, searchType, onSearchTypeChange }: ItemFiltersProps) {
	return (
		<div className="bg-surface p-4 rounded-lg shadow-sm border border-border">
			<div className="flex items-center space-x-4">
				<div className="flex-grow relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary w-5 h-5" />
					<input
						type="text"
						placeholder="Search..."
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-textPrimary placeholder:text-textSecondary focus:outline-none focus:border-primary transition-colors"
					/>
				</div>
				<select
					value={searchType}
					onChange={(e) => onSearchTypeChange(e.target.value as "all" | "categories" | "items")}
					className="px-4 py-2 bg-background border border-border rounded-lg text-textPrimary focus:outline-none focus:border-primary transition-colors"
				>
					<option value="all">All</option>
					<option value="categories">Categories</option>
					<option value="items">Items</option>
				</select>
			</div>
		</div>
	);
}

export default ItemFilters;
