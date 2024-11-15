import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
	Item,
	Category,
	ItemFormData,
	CategoryFormData,
} from "../types/inventory";
import { itemOperations, categoryOperations } from "../utils/db/operations";
import { useNotification } from "../contexts/NotificationContext";

const ITEMS_PER_PAGE = 10;

export function useInventory() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { showNotification } = useNotification();

	const [view, setView] = useState<"categories" | "items">("categories");
	const [items, setItems] = useState<Item[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null
	);
	const [search, setSearch] = useState("");
	const [searchType, setSearchType] = useState<"all" | "categories" | "items">(
		"all"
	);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(1);
	const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
	const [subCategoryCounts, setSubCategoryCounts] = useState<
		Record<string, number>
	>({});
	const [categoryPath, setCategoryPath] = useState<Category[]>([]);
	const [currentCategory, setCurrentCategory] = useState<
		Category | undefined
	>();
	const [isCreateItemModalOpen, setIsCreateItemModalOpen] = useState(false);
	const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
		useState(false);
	const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
	const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
	const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);
	const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] =
		useState(false);
	const [selectedItem, setSelectedItem] = useState<Item | null>(null);

	const loadInitialData = useCallback(async () => {
		setIsLoading(true);
		try {
			const allCategories = await categoryOperations.getAll();
			setCategories(allCategories);

			const counts: Record<string, number> = {};
			const subCounts: Record<string, number> = {};
			for (const category of allCategories) {
				const categoryItems = await itemOperations.getByCategory(category.id, {
					includeSubcategories: true,
				});
				counts[category.id] = categoryItems.length;

				const subCategories = allCategories.filter(
					(c) => c.parentId === category.id
				);
				subCounts[category.id] = subCategories.length;
			}
			setItemCounts(counts);
			setSubCategoryCounts(subCounts);

			// Extract category ID from both URL patterns
			let categoryId: string | null = null;

			// Check URL path for category ID (categories/:id pattern)
			const urlParts = window.location.pathname.split("/");
			if (urlParts.includes("categories")) {
				const lastPart = urlParts[urlParts.length - 1];
				if (lastPart !== "categories") {
					categoryId = lastPart;
				}
			}

			// If not found in path, check query params (items?category=id pattern)
			if (!categoryId) {
				categoryId = searchParams.get("category");
			}

			if (categoryId) {
				const category = allCategories.find((c) => c.id === categoryId);
				if (category) {
					const path = await categoryOperations.getPath(categoryId);
					setCategoryPath(path);
					setCurrentCategory(category);
					setSelectedCategory(category);
					setView(category.isFolder ? "categories" : "items");
					if (!category.isFolder) {
						await loadItems(categoryId, 1);
					}
				}
			}
		} catch (error) {
			console.error("Error loading initial data:", error);
			showNotification("error", "Failed to load inventory data");
		} finally {
			setIsLoading(false);
		}
	}, [searchParams, showNotification]);

	useEffect(() => {
		loadInitialData();
	}, [loadInitialData]);

	// New useEffect to update items when selectedCategory changes
	useEffect(() => {
		if (selectedCategory) {
			// Reset items and pagination
			setItems([]);
			setPage(1);
			setHasMore(true);

			// Load items for the selected category
			loadItems(selectedCategory.id, 1);
		}
	}, [selectedCategory]);

	const resetToRoot = useCallback(() => {
		setView("categories");
		setSelectedCategory(null);
		setCurrentCategory(undefined);
		setCategoryPath([]);
		setItems([]);
		setPage(1);
		navigate("/inventory/categories");
	}, [navigate]);

	const loadItems = useCallback(
		async (categoryId: string, page: number) => {
			try {
				const loadedItems = await itemOperations.getByCategory(categoryId, {
					page,
					limit: ITEMS_PER_PAGE,
					includeSubcategories: false,
				});
				setItems((prev) =>
					page === 1 ? loadedItems : [...prev, ...loadedItems]
				);
				setHasMore(loadedItems.length === ITEMS_PER_PAGE);
			} catch (error) {
				console.error("Error loading items:", error);
				showNotification("error", "Failed to load items");
			}
		},
		[showNotification]
	);

	const handleSearch = useCallback(
		async (query: string) => {
			setSearch(query);
			if (query.trim() === "") {
				if (currentCategory) {
					await loadItems(currentCategory.id, 1);
					const subCategories = await categoryOperations.getChildren(
						currentCategory.id
					);
					setCategories(subCategories);
				} else {
					const rootCategories = await categoryOperations.getChildren(null);
					setCategories(rootCategories);
					setItems([]);
				}
				return;
			}

			let categoryResults: Category[] = [];
			let itemResults: Item[] = [];

			if (searchType === "all" || searchType === "categories") {
				categoryResults = currentCategory
					? await categoryOperations.search(query, currentCategory.id)
					: await categoryOperations.search(query);
			}

			if (searchType === "all" || searchType === "items") {
				itemResults = currentCategory
					? await itemOperations.searchInCategory(currentCategory.id, query)
					: await itemOperations.search(query);
			}

			setCategories(categoryResults);
			setItems(itemResults);
		},
		[currentCategory, searchType, loadItems]
	);

	const handleCreateItem = async (data: ItemFormData) => {
		setIsSubmitting(true);
		try {
			const newItem = await itemOperations.create(data);
			setItems((prev) => [...prev, newItem]);
			if (data.categoryId) {
				setItemCounts((prev) => ({
					...prev,
					[data.categoryId]: (prev[data.categoryId] || 0) + 1,
				}));
			}
			showNotification("success", `Item "${data.name}" created successfully`);
			closeCreateItemModal();
		} catch (error) {
			console.error("Error creating item:", error);
			showNotification("error", "Failed to create item");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEditItem = async (id: string, data: ItemFormData) => {
		setIsSubmitting(true);
		try {
			const updatedItem = await itemOperations.update(id, data);
			setItems((prev) =>
				prev.map((item) => (item.id === id ? updatedItem : item))
			);
			showNotification(
				"success",
				`Item "${updatedItem.name}" updated successfully`
			);
			closeEditItemModal();
		} catch (error) {
			console.error("Error updating item:", error);
			showNotification("error", "Failed to update item");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteItem = async (id: string) => {
		setIsSubmitting(true);
		try {
			await itemOperations.delete(id);
			setItems((prev) => prev.filter((item) => item.id !== id));
			if (currentCategory?.id) {
				setItemCounts((prev) => ({
					...prev,
					[currentCategory.id]: (prev[currentCategory.id] || 0) - 1,
				}));
			}
			showNotification("success", "Item deleted successfully");
			closeDeleteItemModal();
		} catch (error) {
			console.error("Error deleting item:", error);
			showNotification("error", "Failed to delete item");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCreateCategory = async (data: CategoryFormData) => {
		setIsSubmitting(true);
		try {
			const newCategory = await categoryOperations.create({
				...data,
				parentId: currentCategory ? currentCategory.id : undefined,
			});
			setCategories((prev) => [...prev, newCategory]);
			setItemCounts((prev) => ({ ...prev, [newCategory.id]: 0 }));
			setSubCategoryCounts((prev) => ({ ...prev, [newCategory.id]: 0 }));
			if (currentCategory?.id) {
				setSubCategoryCounts((prev) => ({
					...prev,
					[currentCategory.id]: (prev[currentCategory.id] || 0) + 1,
				}));
			}
			showNotification(
				"success",
				`Category "${data.name}" created successfully`
			);
			closeCreateCategoryModal();
			loadInitialData();
		} catch (error) {
			console.error("Error creating category:", error);
			showNotification("error", "Failed to create category");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEditCategory = async (id: string, data: CategoryFormData) => {
		setIsSubmitting(true);
		try {
			const updatedCategory = await categoryOperations.update(id, data);
			setCategories((prev) =>
				prev.map((category) =>
					category.id === id ? updatedCategory : category
				)
			);
			showNotification(
				"success",
				`Category "${updatedCategory.name}" updated successfully`
			);
			closeEditCategoryModal();
			loadInitialData();
		} catch (error) {
			console.error("Error updating category:", error);
			showNotification("error", "Failed to update category");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteCategory = async (id: string) => {
		setIsSubmitting(true);
		try {
			await categoryOperations.delete(id);
			setCategories((prev) => prev.filter((category) => category.id !== id));
			if (currentCategory?.parentId) {
				const parentId = currentCategory.parentId;
				setSubCategoryCounts((prev) => ({
					...prev,
					[parentId]: (prev[parentId] || 0) - 1,
				}));
			}
			showNotification("success", "Category deleted successfully");
			closeDeleteCategoryModal();
			handleBackToParentCategory();
		} catch (error) {
			console.error("Error deleting category:", error);
			showNotification("error", "Failed to delete category");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCategoryClick = useCallback(
		async (categoryId: string) => {
			const category = categories.find((c) => c.id === categoryId);
			if (!category) return;

			setCurrentCategory(category);
			setSelectedCategory(category);
			const path = await categoryOperations.getPath(categoryId);
			setCategoryPath(path);

			if (category.isFolder) {
				setView("categories");
				navigate(`/inventory/categories/${categoryId}`);
			} else {
				setView("items");
				setPage(1);
				await loadItems(categoryId, 1);
				navigate(`/inventory/items?category=${categoryId}`);
			}
		},
		[categories, navigate]
	);

	const handleBackToParentCategory = useCallback(async () => {
		if (currentCategory && currentCategory.parentId) {
			const parentCategory = categories.find(
				(c) => c.id === currentCategory.parentId
			);
			if (parentCategory) {
				await handleCategoryClick(parentCategory.id);
			}
		} else {
			resetToRoot();
		}
	}, [currentCategory, categories, handleCategoryClick]);

	const handleLoadMore = () => {
		if (selectedCategory) {
			const nextPage = page + 1;
			setPage(nextPage);
			loadItems(selectedCategory.id, nextPage);
		}
	};

	const openCreateItemModal = () => setIsCreateItemModalOpen(true);
	const closeCreateItemModal = () => setIsCreateItemModalOpen(false);

	const openCreateCategoryModal = () => setIsCreateCategoryModalOpen(true);
	const closeCreateCategoryModal = () => setIsCreateCategoryModalOpen(false);

	const openEditItemModal = (item: Item) => {
		setSelectedItem(item);
		setIsEditItemModalOpen(true);
	};
	const closeEditItemModal = () => {
		setSelectedItem(null);
		setIsEditItemModalOpen(false);
	};

	const openEditCategoryModal = (category: Category) => {
		setSelectedCategory(category);
		setIsEditCategoryModalOpen(true);
	};
	const closeEditCategoryModal = () => {
		setSelectedCategory(null);
		setIsEditCategoryModalOpen(false);
	};

	const openDeleteItemModal = (item: Item) => {
		setSelectedItem(item);
		setIsDeleteItemModalOpen(true);
	};
	const closeDeleteItemModal = () => {
		setSelectedItem(null);
		setIsDeleteItemModalOpen(false);
	};

	const openDeleteCategoryModal = (category: Category) => {
		setSelectedCategory(category);
		setIsDeleteCategoryModalOpen(true);
	};
	const closeDeleteCategoryModal = () => {
		setSelectedCategory(null);
		setIsDeleteCategoryModalOpen(false);
	};

	const getRootCategories = useCallback(() => {
		return categories.filter(
			(cat) => cat.parentId === null || cat.parentId === undefined
		);
	}, [categories]);

	const getSubcategories = useCallback(
		(parentId: string) => {
			return categories.filter((cat) => cat.parentId === parentId);
		},
		[categories]
	);

	return {
		view,
		setView,
		items,
		categories,
		selectedCategory,
		setSelectedCategory,
		search,
		setSearch,
		searchType,
		setSearchType,
		isSubmitting,
		isLoading,
		hasMore,
		itemCounts,
		subCategoryCounts,
		categoryPath,
		setCategoryPath,
		currentCategory,
		setCurrentCategory,
		isCreateItemModalOpen,
		isCreateCategoryModalOpen,
		isEditItemModalOpen,
		isEditCategoryModalOpen,
		isDeleteItemModalOpen,
		isDeleteCategoryModalOpen,
		selectedItem,
		handleCreateItem,
		handleEditItem,
		handleDeleteItem,
		handleCreateCategory,
		handleEditCategory,
		handleDeleteCategory,
		handleCategoryClick,
		handleBackToParentCategory,
		handleLoadMore,
		handleSearch,
		openCreateItemModal,
		closeCreateItemModal,
		openCreateCategoryModal,
		closeCreateCategoryModal,
		openEditItemModal,
		closeEditItemModal,
		openEditCategoryModal,
		closeEditCategoryModal,
		openDeleteItemModal,
		closeDeleteItemModal,
		openDeleteCategoryModal,
		closeDeleteCategoryModal,
		loadInitialData,
		resetToRoot,
		getRootCategories,
		getSubcategories,
	};
}
