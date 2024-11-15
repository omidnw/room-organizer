// src/components/CategoryBreadcrumb.tsx

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import { Category } from "../../types/inventory";
import { useLocation, Link } from "react-router-dom";

interface CategoryBreadcrumbProps {
	category?: Category;
	categoryPath?: Category[];
}

function CategoryBreadcrumb({
	category,
	categoryPath = [],
}: CategoryBreadcrumbProps) {
	const location = useLocation();
	const isReportsPage = location.pathname.startsWith("/reports");
	const baseUrl = isReportsPage ? "/reports" : "/inventory";

	return (
		<nav className="flex items-center space-x-2 text-sm">
			<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
				<Link
					to={baseUrl}
					className="p-2 rounded-lg hover:bg-surface text-textSecondary hover:text-primary transition-colors"
				>
					<Home className="w-4 h-4" />
				</Link>
			</motion.div>

			{(categoryPath.length > 0 || category) && (
				<ChevronRight className="w-4 h-4 text-textSecondary" />
			)}

			{categoryPath.map((cat, index) => (
				<React.Fragment key={cat.id}>
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: index * 0.1 }}
					>
						<Link
							to={`${baseUrl}/categories/${cat.id}`}
							className="text-textSecondary hover:text-primary transition-colors"
						>
							{cat.name}
						</Link>
					</motion.div>
					<ChevronRight className="w-4 h-4 text-textSecondary" />
				</React.Fragment>
			))}

			{category && (
				<motion.span
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: categoryPath.length * 0.1 }}
					className="text-textPrimary"
				>
					{category.name}
				</motion.span>
			)}
		</nav>
	);
}

export default CategoryBreadcrumb;
