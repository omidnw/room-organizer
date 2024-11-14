import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CategoryBreadcrumb from "../components/categories/CategoryBreadcrumb";
import CategoryCard from "../components/categories/CategoryCard";
import CreateCategoryModal from "../components/categories/modals/CreateCategoryModal";
import EditCategoryModal from "../components/categories/modals/EditCategoryModal";
import DeleteCategoryModal from "../components/categories/modals/DeleteCategoryModal";
import { Category, CategoryFormData } from "../types/inventory";
import { categoryOperations, itemOperations } from "../utils/db/operations";
import { useNotification } from "../contexts/NotificationContext";

interface CategoriesProps {
	mode?: "create" | "edit" | "delete";
}

function Categories({ mode }: CategoriesProps) {
	const navigate = useNavigate();
	const { id } = useParams();
	const { showNotification } = useNotification();

	const [categories, setCategories] = useState<Category[]>([]);
	const [currentCategory, setCurrentCategory] = useState<
		Category | undefined
	>();
	const [categoryPath, setCategoryPath] = useState<Category[]>([]);
	const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadCategories = async () => {
			try {
				setIsLoading(true);
				const allCategories = await categoryOperations.getAll();
				setCategories(allCategories);

				const counts: Record<string, number> = {};
				for (const category of allCategories) {
					const items = await itemOperations.getByCategory(category.id, {
						includeSubcategories: true,
					});
					counts[category.id] = items.length;
				}
				setItemCounts(counts);

				if (id) {
					const category = allCategories.find((c) => c.id === id);
					if (category) {
						const path = await categoryOperations.getPath(id);
						setCategoryPath(path);
						setCurrentCategory(category);
					}
				}
			} catch (error) {
				console.error("Error loading categories:", error);
				showNotification("error", "Failed to load categories");
			} finally {
				setIsLoading(false);
			}
		};

		loadCategories();
	}, [id, showNotification]);

	const visibleCategories = categories.filter((cat) => {
		const matchesParent = currentCategory
			? cat.parentId === currentCategory.id
			: cat.level === 0;

		return matchesParent;
	});

	const handleCreate = async (data: CategoryFormData) => {
		setIsSubmitting(true);
		try {
			const newCategory = await categoryOperations.create(data);
			setCategories((prev) => [...prev, newCategory]);
			setItemCounts((prev) => ({ ...prev, [newCategory.id]: 0 }));
			showNotification(
				"success",
				`Category "${data.name}" created successfully`
			);
			navigate("/inventory/categories");
		} catch (error) {
			console.error("Error creating category:", error);
			showNotification("error", "Failed to create category");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCategoryClick = async (categoryId: string) => {
		const category = categories.find((c) => c.id === categoryId);
		if (!category) return;

		setCurrentCategory(category);
		const path = await categoryOperations.getPath(categoryId);
		setCategoryPath(path);
		navigate(`/inventory/categories/${categoryId}`);
	};

	const handleBack = () => {
		if (currentCategory?.parentId) {
			const parentCategory = categories.find(
				(c) => c.id === currentCategory.parentId
			);
			if (parentCategory) {
				handleCategoryClick(parentCategory.id);
			}
		} else {
			setCurrentCategory(undefined);
			setCategoryPath([]);
			navigate("/inventory/categories");
		}
	};

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
									category={currentCategory}
									categoryPath={categoryPath}
								/>
								<div className="flex items-center space-x-4">
									{currentCategory && (
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={handleBack}
											className="p-2 rounded-lg hover:bg-surface text-textSecondary hover:text-primary transition-colors"
										>
											<ArrowLeft className="w-6 h-6" />
										</motion.button>
									)}
									<h2 className="text-2xl font-bold text-textPrimary">
										{currentCategory ? currentCategory.name : "Categories"}
									</h2>
								</div>
							</div>
						</motion.div>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => navigate("/inventory/categories/new")}
							className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
						>
							<Plus className="w-5 h-5 mr-2" />
							Add Category
						</motion.button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{visibleCategories.map((category) => (
							<CategoryCard
								key={category.id}
								category={category}
								itemCount={itemCounts[category.id] || 0}
								onClick={() => handleCategoryClick(category.id)}
							/>
						))}
					</div>

					{visibleCategories.length === 0 && !isLoading && (
						<div className="text-center py-12">
							<p className="text-textSecondary">
								{currentCategory
									? "No subcategories found"
									: "No categories found"}
							</p>
						</div>
					)}

					{isLoading && (
						<div className="text-center py-12">
							<p className="text-textSecondary">Loading categories...</p>
						</div>
					)}

					<CreateCategoryModal
						isOpen={mode === "create"}
						onSubmit={handleCreate}
						isSubmitting={isSubmitting}
					/>

					{id && (
						<>
							<EditCategoryModal
								isOpen={mode === "edit"}
								categoryId={id}
								initialData={
									categories.find((c) => c.id === id) || { name: "", color: "" }
								}
								onSubmit={handleEdit}
								isSubmitting={isSubmitting}
							/>

							<DeleteCategoryModal
								isOpen={mode === "delete"}
								categoryName={categories.find((c) => c.id === id)?.name || ""}
								onConfirm={() => handleDelete(id)}
								isSubmitting={isSubmitting}
							/>
						</>
					)}
				</div>
			</main>
			<Footer />
		</div>
	);
}

export default Categories;
