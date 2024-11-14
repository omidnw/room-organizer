import React from "react";
import { motion } from "framer-motion";
import { Package, Folder, ChevronRight, Edit2, Trash2 } from "lucide-react";
import Card from "../ui/Card";
import { Category } from "../../types/inventory";

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
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="cursor-pointer"
			onClick={handleClick}
		>
			<Card className="h-full hover:border-primary transition-colors">
				<div className="p-6 flex flex-col h-full">
					<div className="flex items-center justify-between mb-4">
						<div
							className="w-12 h-12 rounded-lg flex items-center justify-center"
							style={{
								backgroundColor: category.color || "var(--color-primary)",
							}}
						>
							{category.isFolder ? (
								<Folder className="w-6 h-6 text-white" />
							) : (
								<Package className="w-6 h-6 text-white" />
							)}
						</div>
						<div className="flex items-center space-x-2">
							<button onClick={handleEdit} className="p-1 hover:bg-surface rounded">
								<Edit2 className="w-4 h-4 text-textSecondary" />
							</button>
							<button
								onClick={handleDelete}
								className="p-1 hover:bg-surface rounded"
							>
								<Trash2 className="w-4 h-4 text-textSecondary" />
							</button>
						</div>
					</div>

					<div>
						<div className="flex items-center justify-between">
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
							<div className="flex items-center text-sm text-textSecondary">
								<span>{itemCount} items</span>
								{subCategoryCount > 0 && (
									<span className="ml-2">{subCategoryCount} subcategories</span>
								)}
								<ChevronRight className="w-4 h-4 ml-1" />
							</div>
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
