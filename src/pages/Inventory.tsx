// src/pages/Inventory.tsx

import React, { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, ArrowLeft } from "lucide-react";
import {
	useNavigate,
	useParams,
	useLocation,
	useSearchParams,
} from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ItemCard from "../components/inventory/ItemCard";
import ItemFilters from "../components/inventory/ItemFilters";
import CategoryCard from "../components/categories/CategoryCard";
import CategoryBreadcrumb from "../components/categories/CategoryBreadcrumb";
import CreateItemModal from "../components/inventory/modals/CreateItemModal";
import CreateCategoryModal from "../components/categories/modals/CreateCategoryModal";
import EditItemModal from "../components/inventory/modals/EditItemModal";
import EditCategoryModal from "../components/categories/modals/EditCategoryModal";
import DeleteItemModal from "../components/inventory/modals/DeleteItemModal";
import DeleteCategoryModal from "../components/categories/modals/DeleteCategoryModal";
import { useInventory } from "../hooks/useInventory";

interface InventoryProps {
	mode?: "create" | "edit" | "delete";
	type?: "item" | "category";
}

function Inventory({ mode, type }: InventoryProps) {
	const { id } = useParams();
	const [searchParams] = useSearchParams();
	const location = useLocation();
	const inventory = useInventory();

	// Load initial data only once when component mounts
	useEffect(() => {
		const loadInitialData = async () => {
			if (location.pathname === "/inventory") {
				inventory.resetToRoot();
			} else if (location.pathname.includes("/inventory/categories")) {
				if (id) {
					await inventory.handleCategoryClick(id);
				} else {
					inventory.resetToRoot();
				}
			} else if (location.pathname.includes("/inventory/items")) {
				const categoryId = searchParams.get("category");
				if (categoryId) {
					await inventory.handleCategoryClick(categoryId);
				} else {
					inventory.resetToRoot();
				}
			}
		};

		loadInitialData();
	}, []); // Empty dependency array for initial load only

	// Handle route changes
	useEffect(() => {
		const handleRouteChange = async () => {
			if (location.pathname === "/inventory") {
				inventory.resetToRoot();
			} else if (location.pathname.includes("/inventory/categories") && id) {
				await inventory.handleCategoryClick(id);
			} else if (location.pathname.includes("/inventory/items")) {
				const categoryId = searchParams.get("category");
				if (categoryId) {
					await inventory.handleCategoryClick(categoryId);
				}
			}
		};

		handleRouteChange();
	}, [id, searchParams, location.pathname]); // Only re-run when route-related props change

	const categoriesToDisplay = inventory.currentCategory
		? inventory.getSubcategories(inventory.currentCategory.id)
		: inventory.getRootCategories();

	const itemsToDisplay =
		inventory.currentCategory && !inventory.currentCategory.isFolder
			? inventory.items
			: [];

	const canCreateCategory =
		!inventory.currentCategory || inventory.currentCategory.isFolder;

	return (
		<div className="flex flex-col min-h-screen bg-background">
			<Header />
			<main className="flex-grow p-8 mt-16">
				<div className="max-w-6xl mx-auto">
					<div className="flex justify-between items-center mb-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
						>
							<div className="flex flex-col space-y-2">
								<CategoryBreadcrumb
									category={inventory.currentCategory}
									categoryPath={inventory.categoryPath}
								/>
								<div className="flex items-center space-x-4">
									{inventory.currentCategory && (
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={inventory.handleBackToParentCategory}
											className="p-2 rounded-lg hover:bg-surface text-textSecondary hover:text-primary transition-colors"
										>
											<ArrowLeft className="w-6 h-6" />
										</motion.button>
									)}
									<h2 className="text-2xl font-bold text-textPrimary">
										{inventory.currentCategory
											? inventory.currentCategory.name
											: "Inventory"}
									</h2>
								</div>
							</div>
						</motion.div>

						<div className="flex space-x-4">
							{canCreateCategory && (
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={inventory.openCreateCategoryModal}
									className="flex items-center px-4 py-2 bg-surface text-textPrimary rounded-lg hover:bg-surface/90 transition-colors"
								>
									<Plus className="w-5 h-5 mr-2" />
									Add Category
								</motion.button>
							)}
							{inventory.currentCategory &&
								!inventory.currentCategory.isFolder && (
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={inventory.openCreateItemModal}
										className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
									>
										<Plus className="w-5 h-5 mr-2" />
										Add Item
									</motion.button>
								)}
						</div>
					</div>

					{inventory.view === "categories" && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{categoriesToDisplay.map((category) => (
								<CategoryCard
									key={category.id}
									category={category}
									itemCount={inventory.itemCounts[category.id] || 0}
									subCategoryCount={
										inventory.subCategoryCounts[category.id] || 0
									}
									onClick={() => inventory.handleCategoryClick(category.id)}
									onEdit={() => inventory.openEditCategoryModal(category)}
									onDelete={() => inventory.openDeleteCategoryModal(category)}
								/>
							))}
						</div>
					)}

					{inventory.view === "items" && (
						<>
							<div className="mb-8">
								<ItemFilters
									search={inventory.search}
									onSearchChange={inventory.handleSearch}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{itemsToDisplay.map((item) => (
									<ItemCard
										key={item.id}
										item={item}
										onEdit={() => inventory.openEditItemModal(item)}
										onDelete={() => inventory.openDeleteItemModal(item)}
									/>
								))}
							</div>

							{inventory.hasMore &&
								!inventory.isLoading &&
								inventory.items.length > 0 && (
									<div className="flex justify-center mt-8">
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={inventory.handleLoadMore}
											className="px-6 py-2 bg-surface border border-border rounded-lg text-textPrimary hover:border-primary transition-colors"
										>
											Load More
										</motion.button>
									</div>
								)}
						</>
					)}

					{inventory.isLoading && (
						<div className="text-center py-12">
							<p className="text-textSecondary">Loading...</p>
						</div>
					)}

					<CreateItemModal
						isOpen={inventory.isCreateItemModalOpen}
						onClose={inventory.closeCreateItemModal}
						onSubmit={inventory.handleCreateItem}
						categories={inventory.categories}
						currentCategory={inventory.currentCategory}
					/>

					<CreateCategoryModal
						isOpen={inventory.isCreateCategoryModalOpen}
						onClose={inventory.closeCreateCategoryModal}
						onSubmit={inventory.handleCreateCategory}
						parentCategory={inventory.currentCategory}
					/>

					{inventory.selectedItem && (
						<>
							<EditItemModal
								isOpen={inventory.isEditItemModalOpen}
								onClose={inventory.closeEditItemModal}
								item={inventory.selectedItem}
								onSubmit={inventory.handleEditItem}
								categories={inventory.categories}
							/>

							<DeleteItemModal
								isOpen={inventory.isDeleteItemModalOpen}
								onClose={inventory.closeDeleteItemModal}
								item={inventory.selectedItem}
								onConfirm={inventory.handleDeleteItem}
							/>
						</>
					)}

					{inventory.selectedCategory && (
						<>
							<EditCategoryModal
								isOpen={inventory.isEditCategoryModalOpen}
								onClose={inventory.closeEditCategoryModal}
								category={inventory.selectedCategory}
								onSubmit={inventory.handleEditCategory}
							/>

							<DeleteCategoryModal
								isOpen={inventory.isDeleteCategoryModalOpen}
								onClose={inventory.closeDeleteCategoryModal}
								category={inventory.selectedCategory}
								itemCount={
									inventory.itemCounts[inventory.selectedCategory.id] || 0
								}
								onConfirm={inventory.handleDeleteCategory}
							/>
						</>
					)}
				</div>
			</main>
			<Footer />
		</div>
	);
}

export default Inventory;
