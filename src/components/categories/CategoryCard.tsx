import React from "react";
import { motion } from "framer-motion";
import { Package, Folder, ChevronRight, Edit2, Trash2 } from "lucide-react";
import Card from "../ui/Card";
import { Category } from "../../types/inventory";
import { useUI } from "../../contexts/UIContext";

interface CategoryCardProps {
	category: Category;
	itemCount: number;
	subCategoryCount: number;
	onClick: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

function CategoryCard({
	category,
	itemCount,
	subCategoryCount,
	onClick,
	onEdit,
	onDelete,
}: CategoryCardProps) {
	const { animations, animationSpeed, compactMode } = useUI();

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onClick();
	};

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		onEdit();
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		onDelete();
	};

	return (
		<motion.div
			initial={animations ? { opacity: 0, y: 20 } : undefined}
			animate={animations ? { opacity: 1, y: 0 } : undefined}
			transition={{ duration: animationSpeed / 1000 }}
			className="cursor-pointer"
			onClick={handleClick}
		>
			<Card className="h-full hover:border-primary transition-colors">
				<div className={`${compactMode ? 'p-4' : 'p-6'} flex flex-col h-full`}>
					<div className="flex items-center justify-between mb-4">
						<div
							className={`${compactMode ? 'w-10 h-10' : 'w-12 h-12'} rounded-lg flex items-center justify-center`}
							style={{
								backgroundColor: category.color || "var(--color-primary)",
							}}
						>
							{category.isFolder ? (
								<Folder className={`${compactMode ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
							) : (
								<Package className={`${compactMode ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
							)}
						</div>
						<div className="flex items-center space-x-2">
							<motion.button 
								onClick={handleEdit} 
								className="p-1 hover:bg-surface rounded"
								whileHover={animations ? { scale: 1.1 } : undefined}
								whileTap={animations ? { scale: 0.95 } : undefined}
								transition={{ duration: animationSpeed / 2000 }}
							>
								<Edit2 className="w-4 h-4 text-textSecondary" />
							</motion.button>
							<motion.button
								onClick={handleDelete}
								className="p-1 hover:bg-surface rounded"
								whileHover={animations ? { scale: 1.1 } : undefined}
								whileTap={animations ? { scale: 0.95 } : undefined}
								transition={{ duration: animationSpeed / 2000 }}
							>
								<Trash2 className="w-4 h-4 text-textSecondary" />
							</motion.button>
						</div>
					</div>

					<div>
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								{category.level > 0 && (
									<div
										className="h-6 border-l border-border mr-2"
										style={{ marginLeft: `${(category.level - 1) * (compactMode ? 8 : 12)}px` }}
									/>
								)}
								<h3 className={`${compactMode ? 'text-base' : 'text-lg'} font-semibold text-textPrimary`}>
									{category.name}
								</h3>
							</div>
							<div className={`flex items-center ${compactMode ? 'text-xs' : 'text-sm'} text-textSecondary`}>
								<span>{itemCount} items</span>
								{subCategoryCount > 0 && (
									<span className="ml-2">{subCategoryCount} subcategories</span>
								)}
								<ChevronRight className="w-4 h-4 ml-1" />
							</div>
						</div>

						{category.description && (
							<p className={`${compactMode ? 'text-xs' : 'text-sm'} text-textSecondary mt-1 ml-6`}>
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
