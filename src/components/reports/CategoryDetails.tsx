import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Package, Folder, ChevronRight, Search, X } from "lucide-react";
import { Category, Item } from "../../types/inventory";
import Card from "../ui/Card";
import Loading from "../ui/Loading";
import { useUI } from "../../contexts/UIContext";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

interface CategoryDetailsProps {
	categories: Category[];
	items: Item[];
	search: string;
	onSearchChange: (query: string) => void;
	onCategorySelect: (category: Category | null) => void;
	currentCategory: Category | undefined;
	itemCounts: Record<string, number>;
	subCategoryCounts: Record<string, number>;
	onBackClick: () => void;
	isLoading?: boolean;
}

function CategoryDetails({
	categories,
	items,
	search,
	onSearchChange,
	onCategorySelect,
	currentCategory,
	itemCounts,
	subCategoryCounts,
	onBackClick,
	isLoading = false,
}: CategoryDetailsProps) {
	const { animations, animationSpeed, compactMode } = useUI();

	const getItemCount = (categoryId: string) => itemCounts[categoryId] || 0;
	const getSubCategoryCount = (categoryId: string) =>
		subCategoryCounts[categoryId] || 0;

	const handleCategoryClick = (category: Category) => {
		console.log("Category clicked with ID:", category.id);
		onCategorySelect(category);
	};

	const chartData = {
		labels: categories.map((category) => category.name),
		datasets: [
			{
				label: "Items",
				data: categories.map((category) => getItemCount(category.id)),
				backgroundColor: categories.map((category) =>
					category.color ? `${category.color}40` : "rgba(75, 192, 192, 0.2)"
				),
				borderColor: categories.map((category) =>
					category.color ? category.color : "rgba(75, 192, 192, 1)"
				),
				borderWidth: 1,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				callbacks: {
					label: function (context: { dataIndex: number }) {
						const categoryIndex = context.dataIndex;
						const category = categories[categoryIndex];
						return [
							`Items: ${getItemCount(category.id)}`,
							`Subcategories: ${getSubCategoryCount(category.id)}`,
						];
					},
				},
			},
		},
		onClick: (_event: MouseEvent, elements: { index: number }[]) => {
			if (elements.length > 0) {
				const index = elements[0].index;
				const selectedCategory = categories[index];
				handleCategoryClick(selectedCategory);
			}
		},
	};

	if (isLoading) {
		return (
			<div className="flex justify-center py-12">
				<Loading size="medium" />
			</div>
		);
	}

	return (
		<div className={`space-y-${compactMode ? "4" : "6"}`}>
			{/* Search Bar */}
			<motion.div
				initial={animations ? { opacity: 0, y: 20 } : undefined}
				animate={animations ? { opacity: 1, y: 0 } : undefined}
				transition={{ duration: animationSpeed / 1000 }}
			>
				<Card className="relative">
					<div className="flex items-center">
						<Search className="w-5 h-5 text-textSecondary absolute left-4" />
						<input
							type="text"
							value={search}
							onChange={(e) => onSearchChange(e.target.value)}
							placeholder="Search all categories..."
							className={`w-full pl-12 pr-4 ${compactMode ? "py-2" : "py-3"} bg-background/50 backdrop-blur-[var(--blur-strength)] border border-border rounded-lg text-textPrimary focus:outline-none focus:border-primary transition-colors`}
						/>
						{search && (
							<button
								onClick={() => onSearchChange("")}
								className="absolute right-4 p-1 hover:bg-surface rounded-full"
							>
								<X className="w-4 h-4 text-textSecondary" />
							</button>
						)}
					</div>
				</Card>
			</motion.div>

			<AnimatePresence mode="wait">
				{!currentCategory ? (
					/* Category List */
					<motion.div
						initial={animations ? { opacity: 0, y: 20 } : undefined}
						animate={animations ? { opacity: 1, y: 0 } : undefined}
						exit={animations ? { opacity: 0, y: -20 } : undefined}
						transition={{ duration: animationSpeed / 1000 }}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
					>
						{categories.map((category, index) => (
							<motion.div
								key={category.id}
								initial={animations ? { opacity: 0, y: 20 } : undefined}
								animate={animations ? { opacity: 1, y: 0 } : undefined}
								transition={{
									delay: index * 0.1,
									duration: animationSpeed / 1000,
								}}
								whileHover={animations ? { scale: 1.02 } : undefined}
								whileTap={animations ? { scale: 0.98 } : undefined}
							>
								<Card
									className="cursor-pointer hover:border-primary transition-colors"
									onClick={() => {
										console.log("Clicking category:", category);
										handleCategoryClick(category);
									}}
									data-category-id={category.id}
								>
									<div
										className={`flex items-center justify-between ${compactMode ? "p-3" : "p-4"}`}
									>
										<div className="flex items-center space-x-3">
											<div
												className="w-10 h-10 rounded-lg flex items-center justify-center"
												style={{ backgroundColor: category.color }}
											>
												{category.isFolder ? (
													<Folder className="w-5 h-5 text-white" />
												) : (
													<Package className="w-5 h-5 text-white" />
												)}
											</div>
											<div>
												<h3 className="font-medium text-textPrimary">
													{category.name}
												</h3>
												<p className="text-sm text-textSecondary">
													{getSubCategoryCount(category.id)} subcategories,{" "}
													{getItemCount(category.id)} items
												</p>
											</div>
										</div>
										<ChevronRight className="w-5 h-5 text-textSecondary" />
									</div>
								</Card>
							</motion.div>
						))}
					</motion.div>
				) : (
					/* Category Details View */
					<motion.div
						initial={animations ? { opacity: 0, y: 20 } : undefined}
						animate={animations ? { opacity: 1, y: 0 } : undefined}
						exit={animations ? { opacity: 0, y: -20 } : undefined}
						transition={{ duration: animationSpeed / 1000 }}
						className={`space-y-${compactMode ? "4" : "6"}`}
					>
						{/* Subcategories */}
						{categories.length > 0 && (
							<Card>
								<div className={`${compactMode ? "p-4" : "p-6"}`}>
									<h3
										className={`${compactMode ? "text-base" : "text-lg"} font-semibold mb-4`}
									>
										Subcategories
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{categories.map((category, index) => (
											<motion.div
												key={category.id}
												initial={animations ? { opacity: 0, y: 20 } : undefined}
												animate={animations ? { opacity: 1, y: 0 } : undefined}
												transition={{
													delay: index * 0.1,
													duration: animationSpeed / 1000,
												}}
												whileHover={animations ? { scale: 1.02 } : undefined}
												whileTap={animations ? { scale: 0.98 } : undefined}
												className={`flex items-center justify-between ${compactMode ? "p-3" : "p-4"} bg-background/50 backdrop-blur-[var(--blur-strength)] rounded-lg cursor-pointer hover:bg-surface transition-colors`}
												onClick={() => {
													console.log("Clicking subcategory:", category);
													handleCategoryClick(category);
												}}
												data-category-id={category.id}
											>
												<div className="flex items-center space-x-3">
													<div
														className="w-8 h-8 rounded-lg flex items-center justify-center"
														style={{ backgroundColor: category.color }}
													>
														{category.isFolder ? (
															<Folder className="w-4 h-4 text-white" />
														) : (
															<Package className="w-4 h-4 text-white" />
														)}
													</div>
													<div>
														<p className="font-medium text-textPrimary">
															{category.name}
														</p>
														<p className="text-sm text-textSecondary">
															{getSubCategoryCount(category.id)} subcategories,{" "}
															{getItemCount(category.id)} items
														</p>
													</div>
												</div>
												<ChevronRight className="w-4 h-4 text-textSecondary" />
											</motion.div>
										))}
									</div>
								</div>
							</Card>
						)}

						{/* Chart */}
						<Card>
							<div className={`${compactMode ? "p-4" : "p-6"}`}>
								<h3
									className={`${compactMode ? "text-base" : "text-lg"} font-semibold mb-4`}
								>
									Items Distribution
								</h3>
								<Bar data={chartData} options={chartOptions} />
							</div>
						</Card>

						{/* Items */}
						{items.length > 0 && (
							<Card>
								<div className={`${compactMode ? "p-4" : "p-6"}`}>
									<h3
										className={`${compactMode ? "text-base" : "text-lg"} font-semibold mb-4`}
									>
										Items in {currentCategory?.name}
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{items
											.filter((item) => item.categoryId === currentCategory?.id)
											.map((item, index) => (
												<motion.div
													key={item.id}
													initial={
														animations ? { opacity: 0, y: 20 } : undefined
													}
													animate={
														animations ? { opacity: 1, y: 0 } : undefined
													}
													transition={{
														delay: index * 0.1,
														duration: animationSpeed / 1000,
													}}
													whileHover={animations ? { scale: 1.02 } : undefined}
													className={`${compactMode ? "p-3" : "p-4"} bg-background/50 backdrop-blur-[var(--blur-strength)] rounded-lg border border-border hover:border-primary transition-colors`}
												>
													<div className="flex items-center justify-between mb-2">
														<h4 className="font-medium text-textPrimary">
															{item.name}
														</h4>
														<span className="text-sm font-medium text-primary">
															${item.price}
														</span>
													</div>
													<div className="flex items-center justify-between text-sm text-textSecondary">
														<span>Quantity: {item.quantity}</span>
														<span>Total: ${item.price * item.quantity}</span>
													</div>
													{item.description && (
														<p className="mt-2 text-sm text-textSecondary">
															{item.description}
														</p>
													)}
													{item.purchaseDate && (
														<p className="mt-1 text-xs text-textSecondary">
															Purchased:{" "}
															{new Date(item.purchaseDate).toLocaleDateString()}
														</p>
													)}
												</motion.div>
											))}
									</div>
								</div>
							</Card>
						)}

						{/* Back Button */}
						<motion.button
							whileHover={animations ? { scale: 1.02 } : undefined}
							whileTap={animations ? { scale: 0.98 } : undefined}
							onClick={() => onCategorySelect(null)}
							className={`w-full ${compactMode ? "p-3" : "p-4"} bg-background/50 backdrop-blur-[var(--blur-strength)] border border-border rounded-lg text-textPrimary hover:border-primary transition-colors`}
						>
							Back to Categories
						</motion.button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default CategoryDetails;
