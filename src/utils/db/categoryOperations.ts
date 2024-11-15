import { v4 as uuidv4 } from "uuid";
import { getDB } from "./config";
import { Category, CategoryFormData } from "../../types/inventory";

// Category Operations
export const categoryOperations = {
	async create(data: CategoryFormData): Promise<Category> {
		const db = await getDB();
		const id = uuidv4();

		// Calculate path and level
		let path: string[] = [];
		let level = 0;

		if (data.parentId) {
			const parent = await this.getById(data.parentId);
			if (parent) {
				path = [...parent.path, parent.id];
				level = parent.level + 1;
			}
		}

		const newCategory: Category = {
			id,
			name: data.name,
			color: data.color,
			description: data.description,
			parentId: data.parentId ?? null,
			isFolder: data.isFolder ?? false,
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
			// Preserve required fields
			name: data.name ?? category.name,
			color: data.color ?? category.color,
			isFolder: data.isFolder ?? category.isFolder,
			path: category.path,
			level: category.level,
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
		const category = await db.get("categories", id);
		if (!category) return undefined;

		return {
			...category,
			isFolder: category.isFolder ?? false,
			path: category.path ?? [],
			level: category.level ?? 0,
		} as Category;
	},

	async getAll(): Promise<Category[]> {
		const db = await getDB();
		const categories = await db.getAllFromIndex("categories", "by-name");
		return categories.map((category) => ({
			...category,
			isFolder: category.isFolder ?? false,
			path: category.path ?? [],
			level: category.level ?? 0,
		})) as Category[];
	},

	async search(
		query: string,
		parentId?: string | undefined
	): Promise<Category[]> {
		const allCategories = await this.getAll();
		const searchLower = query.toLowerCase();

		return allCategories.filter(
			(category) =>
				(parentId === undefined || category.parentId === parentId) &&
				(category.name.toLowerCase().includes(searchLower) ||
					category.description?.toLowerCase().includes(searchLower))
		);
	},

	async getChildren(parentId: string | null): Promise<Category[]> {
		const allCategories = await this.getAll();
		return allCategories.filter((cat) => cat.parentId === parentId);
	},

	async getPath(categoryId: string): Promise<Category[]> {
		const category = await this.getById(categoryId);
		if (!category) return [];

		const path = await Promise.all(category.path.map((id) => this.getById(id)));
		return path.filter((cat): cat is Category => cat !== undefined);
	},

	async getDescendants(categoryId: string): Promise<Category[]> {
		const allCategories = await this.getAll();
		return allCategories.filter((cat) => cat.path.includes(categoryId));
	},

	async getRecent(limit: number = 5): Promise<Category[]> {
		const db = await getDB();
		const categories =
			(await db.getAllFromIndex("categories", "by-updated")) || [];
		// Convert updatedAt strings to Date objects and sort
		const sorted = categories
			.map((cat) => ({
				...cat,
				updatedAt: new Date(cat.updatedAt),
			}))
			.sort((a, b) => {
				const timeComparison = b.updatedAt.getTime() - a.updatedAt.getTime();
				return timeComparison !== 0 ? timeComparison : a.id.localeCompare(b.id);
			});

		// Take first 'limit' items
		return sorted.slice(0, limit);
	},
};
