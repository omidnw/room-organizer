import React from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useUI } from "../../contexts/UIContext";

interface CategoryFiltersProps {
	search: string;
	onSearchChange: (value: string) => void;
}

function CategoryFilters({ search, onSearchChange }: CategoryFiltersProps) {
	const { animations, animationSpeed, compactMode } = useUI();

	return (
		<motion.div
			initial={animations ? { opacity: 0, y: 20 } : undefined}
			animate={animations ? { opacity: 1, y: 0 } : undefined}
			transition={{ duration: animationSpeed / 1000 }}
			className={`glass-effect ${compactMode ? "p-3" : "p-4"} rounded-lg border border-border`}
		>
			<div className="flex items-center">
				{/* Search Input */}
				<div className="flex-grow">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary w-5 h-5" />
						<motion.input
							whileFocus={animations ? { scale: 1.01 } : undefined}
							transition={{ duration: animationSpeed / 2000 }}
							type="text"
							placeholder="Search categories..."
							value={search}
							onChange={(e) => onSearchChange(e.target.value)}
							className={`w-full pl-10 pr-4 ${
								compactMode ? "py-1.5" : "py-2"
							} bg-background/50 backdrop-blur-[var(--blur-strength)] border border-border rounded-lg text-textPrimary placeholder:text-textSecondary focus:outline-none focus:border-primary transition-colors`}
						/>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default CategoryFilters;
