import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Category, Item } from "../types/inventory";
import { categoryOperations, itemOperations } from "../utils/db/operations";

export function useReports() {
	const { id } = useParams();
	const navigate = useNavigate();
	const location = useLocation();

	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null
	);
	const [categories, setCategories] = useState<Category[]>([]);
	const [items, setItems] = useState<Item[]>([]);
	const [categoryPath, setCategoryPath] = useState<Category[]>([]);
	const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
	const [subCategoryCounts, setSubCategoryCounts] = useState<
		Record<string, number>
	>({});
	const [search, setSearch] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	// Load initial data
	const loadInitialData = useCallback(async () => {
		setIsLoading(true);
		try {
			const [allCategories, allItems] = await Promise.all([
				categoryOperations.getAll(),
				itemOperations.getAll(),
			]);

			setCategories(allCategories);

			// Calculate counts
			const counts: Record<string, number> = {};
			const subCounts: Record<string, number> = {};

			allCategories.forEach((category) => {
				counts[category.id] = allItems.filter(
					(item) => item.categoryId === category.id
				).length;
				subCounts[category.id] = allCategories.filter(
					(c) => c.parentId === category.id
				).length;
			});

			setItemCounts(counts);
			setSubCategoryCounts(subCounts);

			// If we have an ID in the URL, load that category
			if (id) {
				const category = allCategories.find((c) => c.id === id);
				if (category) {
					await loadCategoryData(category);
				} else {
					navigate("/reports");
				}
			} else {
				setItems(allItems);
				// Reset selected category when on root path
				if (location.pathname === "/reports") {
					setSelectedCategory(null);
					setCategoryPath([]);
				}
			}
		} catch (error) {
			console.error("Error loading initial data:", error);
		} finally {
			setIsLoading(false);
		}
	}, [id, navigate, location.pathname]);

	useEffect(() => {
		loadInitialData();
	}, [loadInitialData, id]); // Add id as dependency

	const loadCategoryData = useCallback(async (category: Category) => {
		console.log("Loading data for category:", category.id);
		try {
			const [path, categoryItems] = await Promise.all([
				categoryOperations.getPath(category.id),
				itemOperations.getByCategory(category.id, {
					includeSubcategories: true,
				}),
			]);

			setSelectedCategory(category);
			setCategoryPath(path);
			setItems(categoryItems);
		} catch (error) {
			console.error("Error loading category data:", error);
		}
	}, []);

	const getCurrentCategories = useCallback(() => {
		if (search.trim()) {
			return categories.filter(
				(category) =>
					category.name.toLowerCase().includes(search.toLowerCase()) ||
					category.description?.toLowerCase().includes(search.toLowerCase())
			);
		}

		// Always show root categories when no category is selected
		if (!selectedCategory) {
			return categories.filter((cat) => !cat.parentId);
		}

		// Show subcategories of selected category
		return categories.filter((cat) => cat.parentId === selectedCategory.id);
	}, [categories, selectedCategory, search]);

	const handleCategoryClick = useCallback(
		async (category: Category | null) => {
			setIsLoading(true);
			try {
				if (category) {
					console.log("Handling category click:", category.id);
					// Navigate first
					navigate(`/reports/categories/${category.id}`);
					// Then load data
					await loadCategoryData(category);
				} else {
					navigate("/reports");
					setSelectedCategory(null);
					setCategoryPath([]);
					const allItems = await itemOperations.getAll();
					setItems(allItems);
				}
				setSearch("");
			} catch (error) {
				console.error("Error handling category click:", error);
			} finally {
				setIsLoading(false);
			}
		},
		[navigate, loadCategoryData]
	);

	const handleBackToParent = useCallback(async () => {
		if (selectedCategory?.parentId) {
			const parentCategory = categories.find(
				(c) => c.id === selectedCategory.parentId
			);
			if (parentCategory) {
				await handleCategoryClick(parentCategory);
			}
		} else {
			await handleCategoryClick(null);
		}
	}, [categories, selectedCategory, handleCategoryClick]);

	const handleSearch = useCallback((query: string) => {
		setSearch(query);
	}, []);

	const calculateTotals = useCallback(() => {
		// If we're at root level, show totals for everything
		if (!selectedCategory) {
			return {
				totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
				totalValue: items.reduce(
					(sum, item) => sum + item.price * item.quantity,
					0
				),
				totalCategories: categories.length,
			};
		}

		// Get all subcategory IDs recursively
		const getSubcategoryIds = (parentId: string): string[] => {
			const subCats = categories.filter((cat) => cat.parentId === parentId);
			return subCats.reduce((ids: string[], cat) => {
				return [...ids, cat.id, ...getSubcategoryIds(cat.id)];
			}, []);
		};

		const subcategoryIds = getSubcategoryIds(selectedCategory.id);

		// Get items directly in this category
		const directItems = items.filter(
			(item) => item.categoryId === selectedCategory.id
		);

		// Get items in subcategories (for total counts only)
		const subcategoryItems = items.filter((item) =>
			subcategoryIds.includes(item.categoryId)
		);

		// Calculate totals including subcategories
		const totalItems =
			directItems.reduce((sum, item) => sum + item.quantity, 0) +
			subcategoryItems.reduce((sum, item) => sum + item.quantity, 0);

		const totalValue =
			directItems.reduce((sum, item) => sum + item.price * item.quantity, 0) +
			subcategoryItems.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0
			);

		return {
			totalItems,
			totalValue,
			totalCategories: subcategoryIds.length,
			directItems, // Add this to separate direct items
		};
	}, [selectedCategory, categories, items]);

	return {
		selectedCategory,
		categories: getCurrentCategories(),
		items,
		categoryPath,
		itemCounts,
		subCategoryCounts,
		search,
		isLoading,
		handleCategoryClick,
		handleBackToParent,
		handleSearch,
		setSearch,
		calculateTotals,
	};
}
