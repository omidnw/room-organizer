import { v4 as uuidv4 } from "uuid";
import { getDB } from "./config";
import {
	Category,
	CategoryFormData,
	Item,
	ItemFormData,
} from "../../types/inventory";

// Category Operations
export const categoryOperations = {
	async create(category: CategoryFormData): Promise<Category> {
		const db = await getDB();
		const id = uuidv4();

		// Calculate path and level
		let path: string[] = [];
		let level = 0;

		if (category.parentId) {
			const parent = await this.getById(category.parentId);
			if (parent) {
				path = [...parent.path, parent.id];
				level = parent.level + 1;
			}
		}

		const newCategory: Category = {
			id,
			...category,
			path,
			level,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		await db.add("categories", newCategory);
		return newCategory;
	},

	async update(id: string, data: Partial<CategoryFormData>): Promise<Category> {
		const db = await getDB();
		const category = await db.get("categories", id);
		if (!category) throw new Error("Category not found");

		const updatedCategory: Category = {
			...category,
			...data,
			updatedAt: new Date(),
		};
		await db.put("categories", updatedCategory);
		return updatedCategory;
	},

	async delete(id: string): Promise<void> {
		const db = await getDB();
		await db.delete("categories", id);
	},

	async getById(id: string): Promise<Category | undefined> {
		const db = await getDB();
		return db.get("categories", id);
	},

	async getAll(): Promise<Category[]> {
		const db = await getDB();
		return db.getAllFromIndex("categories", "by-name");
	},

	async search(query: string): Promise<Category[]> {
		const db = await getDB();
		const allCategories = await db.getAllFromIndex("categories", "by-name");
		const searchLower = query.toLowerCase();

		return allCategories.filter(
			(category) =>
				category.name.toLowerCase().includes(searchLower) ||
				category.description?.toLowerCase().includes(searchLower)
		);
	},

	async getChildren(parentId: string | null): Promise<Category[]> {
		const db = await getDB();
		const allCategories = await db.getAllFromIndex("categories", "by-name");
		return allCategories.filter((cat) => cat.parentId === parentId);
	},

	async getPath(categoryId: string): Promise<Category[]> {
		const db = await getDB();
		const category = await this.getById(categoryId);
		if (!category) return [];

		const path = await Promise.all(category.path.map((id) => this.getById(id)));

		return path.filter((cat): cat is Category => cat !== undefined);
	},

	async getDescendants(categoryId: string): Promise<Category[]> {
		const db = await getDB();
		const allCategories = await db.getAllFromIndex("categories", "by-name");
		return allCategories.filter((cat) => cat.path.includes(categoryId));
	},
};

// Item Operations
export const itemOperations = {
	async create(item: ItemFormData): Promise<Item> {
		const db = await getDB();
		const id = uuidv4();
		const newItem: Item = {
			id,
			...item,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		await db.add("items", newItem);
		return newItem;
	},

	async update(id: string, data: Partial<ItemFormData>): Promise<Item> {
		const db = await getDB();
		const item = await db.get("items", id);
		if (!item) throw new Error("Item not found");

		const updatedItem: Item = {
			...item,
			...data,
			updatedAt: new Date(),
		};
		await db.put("items", updatedItem);
		return updatedItem;
	},

	async delete(id: string): Promise<void> {
		const db = await getDB();
		await db.delete("items", id);
	},

	async getById(id: string): Promise<Item | undefined> {
		const db = await getDB();
		return db.get("items", id);
	},

	async getByCategory(
		categoryId: string,
		options?: { page?: number; limit?: number; includeSubcategories?: boolean }
	): Promise<Item[]> {
		const db = await getDB();
		let items: Item[] = [];

		if (options?.includeSubcategories) {
			// Get all descendant categories
			const descendants = await categoryOperations.getDescendants(categoryId);
			const categoryIds = [categoryId, ...descendants.map((cat) => cat.id)];

			// Get items from all categories
			for (const catId of categoryIds) {
				const categoryItems = await db.getAllFromIndex(
					"items",
					"by-category",
					catId
				);
				items = [...items, ...categoryItems];
			}
		} else {
			items = await db.getAllFromIndex("items", "by-category", categoryId);
		}

		if (options?.page && options?.limit) {
			const start = (options.page - 1) * options.limit;
			const end = start + options.limit;
			return items.slice(start, end);
		}

		return items;
	},

	async getAll(options?: { page?: number; limit?: number }): Promise<Item[]> {
		const db = await getDB();
		const allItems = await db.getAllFromIndex("items", "by-name");

		if (options?.page && options?.limit) {
			const start = (options.page - 1) * options.limit;
			const end = start + options.limit;
			return allItems.slice(start, end);
		}

		return allItems;
	},

	async search(query: string): Promise<Item[]> {
		const db = await getDB();
		const allItems = await db.getAllFromIndex("items", "by-name");
		const searchLower = query.toLowerCase();
		return allItems.filter(
			(item) =>
				item.name.toLowerCase().includes(searchLower) ||
				item.description?.toLowerCase().includes(searchLower)
		);
	},

	async searchInCategory(
		categoryId: string,
		query: string,
		options?: { page?: number; limit?: number }
	): Promise<Item[]> {
		const db = await getDB();
		const items = await db.getAllFromIndex("items", "by-category", categoryId);

		const searchLower = query.toLowerCase();
		const filteredItems = items.filter(
			(item) =>
				item.name.toLowerCase().includes(searchLower) ||
				item.description?.toLowerCase().includes(searchLower) ||
				item.notes?.toLowerCase().includes(searchLower)
		);

		if (options?.page && options?.limit) {
			const start = (options.page - 1) * options.limit;
			const end = start + options.limit;
			return filteredItems.slice(start, end);
		}

		return filteredItems;
	},
};

// Helper functions
export const dbHelpers = {
	async initialize() {
		const db = await getDB();
		const categories = await categoryOperations.getAll();

		if (categories.length === 0) {
			// Create main storage folders
			const storage = await categoryOperations.create({
				name: "Storage",
				color: "#3B82F6",
				description: "Main storage areas",
				isFolder: true,
			});

			const furniture = await categoryOperations.create({
				name: "Furniture",
				color: "#10B981",
				description: "Furniture storage",
				isFolder: true,
			});

			// Add subcategories
			await Promise.all([
				// Storage subcategories
				categoryOperations.create({
					name: "Storage Boxes",
					color: "#F97316",
					description: "Items in storage boxes",
					parentId: storage.id,
				}),
				categoryOperations.create({
					name: "Wall Shelves",
					color: "#14B8A6",
					description: "Items on wall-mounted shelves",
					parentId: storage.id,
				}),

				// Furniture subcategories
				categoryOperations.create({
					name: "Desk Drawers",
					color: "#10B981",
					description: "Items in desk drawers",
					parentId: furniture.id,
				}),
				categoryOperations.create({
					name: "Wardrobe",
					color: "#F59E0B",
					description: "Clothes and items in wardrobe",
					parentId: furniture.id,
				}),
				categoryOperations.create({
					name: "Bedside Cabinet",
					color: "#8B5CF6",
					description: "Items in bedside drawers",
					parentId: furniture.id,
				}),
				categoryOperations.create({
					name: "Under-bed Storage",
					color: "#EC4899",
					description: "Items stored under the bed",
					parentId: furniture.id,
				}),
			]);
		}
	},

	async exportData() {
		const categories = await categoryOperations.getAll();
		const items = await itemOperations.getAll();
		return { categories, items };
	},

	async importData(data: { categories: Category[]; items: Item[] }) {
		const db = await getDB();
		const tx = db.transaction(["categories", "items"], "readwrite");

		await Promise.all([
			...data.categories.map((cat) => tx.store.add(cat)),
			...data.items.map((item) => tx.objectStore("items").add(item)),
		]);

		await tx.done;
	},
};
