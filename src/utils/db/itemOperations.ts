import { v4 as uuidv4 } from "uuid";
import { getDB } from "./config";
import { Item, ItemFormData } from "../../types/inventory";
import { categoryOperations } from "./operations";

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

	async getRecent(limit: number = 5): Promise<Item[]> {
		const db = await getDB();
		const items = (await db.getAllFromIndex("items", "by-updated")) || [];
		// Convert updatedAt strings to Date objects and sort
		const sorted = items
			.map((item) => ({
				...item,
				updatedAt: new Date(item.updatedAt),
			}))
			.sort((a, b) => {
				const timeComparison = b.updatedAt.getTime() - a.updatedAt.getTime();
				return timeComparison !== 0 ? timeComparison : a.id.localeCompare(b.id);
			});

		// Take first 'limit' items
		return sorted.slice(0, limit);
	},
};
