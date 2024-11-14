// src/components/CategoryBreadcrumb.tsx

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Category } from "../../types/inventory";
import { useInventory } from "../../hooks/useInventory";

interface CategoryBreadcrumbProps {
	category?: Category;
	categoryPath: Category[];
}

function CategoryBreadcrumb({
	category,
	categoryPath,
}: CategoryBreadcrumbProps) {
	const { handleCategoryClick, resetToRoot } = useInventory();
	const navigate = useNavigate();

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex items-center space-x-2 text-sm"
		>
			<motion.button
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
				onClick={() => navigate("/inventory")}
				className="flex items-center text-textSecondary hover:text-primary transition-colors"
			>
				<Home className="w-4 h-4" />
			</motion.button>

			{categoryPath.map((cat, index) => (
				<React.Fragment key={cat.id}>
					<ChevronRight className="w-4 h-4 text-textSecondary" />
					<motion.div whileHover={{ scale: 1.05 }}>
						<Link
							to="#"
							className="text-textSecondary hover:text-primary transition-colors"
							onClick={(e) => {
								e.preventDefault();
								handleCategoryClick(cat.id);
							}}
						>
							{cat.name}
						</Link>
					</motion.div>
				</React.Fragment>
			))}

			{category && (
				<>
					<ChevronRight className="w-4 h-4 text-textSecondary" />
					<motion.div whileHover={{ scale: 1.05 }}>
						<span className="text-textPrimary font-medium">
							{category.name}
						</span>
					</motion.div>
				</>
			)}
		</motion.div>
	);
}

export default CategoryBreadcrumb;
