import React from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useUI } from "../../contexts/UIContext";
import Select from "../ui/Select";

interface ItemFiltersProps {
	search: string;
	onSearchChange: (value: string) => void;
	searchType: "all" | "categories" | "items";
	onSearchTypeChange: (value: "all" | "categories" | "items") => void;
}

function ItemFilters({ search, onSearchChange, searchType, onSearchTypeChange }: ItemFiltersProps) {
	const { compactMode } = useUI();

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`glass-effect-strong ${compactMode ? "p-4" : "p-6"} rounded-lg border border-border`}
		>
			<div className="flex items-center space-x-4">
				<div className="flex-grow relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary w-5 h-5" />
					<input
						type="text"
						placeholder="Search..."
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						className={`w-full pl-10 pr-4 ${compactMode ? "py-2" : "py-2.5"} glass-effect border border-border rounded-lg text-textPrimary placeholder:text-textSecondary focus:outline-none focus:border-primary transition-colors`}
					/>
				</div>
				<Select
					value={searchType}
					onChange={onSearchTypeChange}
					options={[
						{ value: "all", label: "All" },
						{ value: "categories", label: "Categories" },
						{ value: "items", label: "Items" }
					]}
					className={`${compactMode ? "!py-2" : "!py-2.5"}`}
				/>
			</div>
		</motion.div>
	);
}

export default ItemFilters;
