import React from "react";
import { motion } from "framer-motion";
import { Package, Grid, BarChart2, ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StatBox from "../components/home/StatBox";
import CategoryDetails from "../components/reports/CategoryDetails";
import CategoryBreadcrumb from "../components/categories/CategoryBreadcrumb";
import Loading from "../components/ui/Loading";
import { useReports } from "../hooks/useReports";
import { useUI } from "../contexts/UIContext";

function Reports() {
	const { compactMode } = useUI();
	const {
		selectedCategory,
		categories,
		categoryPath,
		items,
		itemCounts,
		subCategoryCounts,
		search,
		isLoading,
		handleCategoryClick,
		handleBackToParent,
		handleSearch,
		setSearch,
		calculateTotals,
	} = useReports();

	const getStatTitles = () => {
		if (!selectedCategory) {
			return {
				items: "Total Items",
				categories: "Total Categories",
				value: "Total Value",
			};
		}

		return {
			items: "Items in Category",
			categories: "Subcategories",
			value: "Category Value",
		};
	};

	const titles = getStatTitles();
	const totals = calculateTotals();

	if (isLoading) {
		return (
			<div className="flex flex-col min-h-screen">
				<Header />
				<main className={`flex-grow ${compactMode ? "p-4" : "p-8"} mt-16`}>
					<div className="max-w-6xl mx-auto flex items-center justify-center h-full">
						<Loading size="large" />
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className={`flex-grow ${compactMode ? "p-4" : "p-8"} mt-16`}>
				<div className={`max-w-6xl mx-auto container-glass ${compactMode ? "space-y-6" : "space-y-10"}`}>
					<div className={`glass-effect ${compactMode ? "p-4" : "p-6"} rounded-lg`}>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
						>
							<div className="flex flex-col space-y-2">
								<CategoryBreadcrumb
									category={selectedCategory || undefined}
									categoryPath={categoryPath}
								/>
								<div className="flex items-center space-x-4">
									{selectedCategory && (
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={handleBackToParent}
											className="p-2 rounded-lg hover:bg-surface text-textSecondary hover:text-primary transition-colors"
										>
											<ArrowLeft className="w-6 h-6" />
										</motion.button>
									)}
									<h2 className={`${compactMode ? "text-2xl" : "text-3xl"} font-bold text-textPrimary`}>
										{selectedCategory ? selectedCategory.name : "Reports"}
									</h2>
								</div>
							</div>
						</motion.div>
					</div>

					{/* Stats Grid */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${compactMode ? "gap-4" : "gap-6"}`}
					>
						<StatBox
							title={titles.items}
							value={totals.totalItems}
							icon={Package}
						/>
						<StatBox
							title={titles.categories}
							value={totals.totalCategories}
							icon={Grid}
						/>
						<StatBox
							title={titles.value}
							value={totals.totalValue}
							icon={BarChart2}
							isCurrency
						/>
					</motion.div>

					{/* Category Details with Loading State */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className={`glass-effect ${compactMode ? "p-4" : "p-6"} rounded-lg`}
					>
						{isLoading ? (
							<div className="flex justify-center py-12">
								<Loading size="medium" />
							</div>
						) : (
							<CategoryDetails
								categories={categories}
								items={items}
								search={search}
								onSearchChange={(query: string) => {
									setSearch(query);
									handleSearch(query);
								}}
								onCategorySelect={handleCategoryClick}
								currentCategory={selectedCategory || undefined}
								itemCounts={itemCounts}
								subCategoryCounts={subCategoryCounts}
								onBackClick={handleBackToParent}
							/>
						)}
					</motion.div>
				</div>
			</main>
			<Footer />
		</div>
	);
}

export default Reports;
