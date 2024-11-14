// src/migrations/002_add_category_hierarchy.migration.ts
import { Migration } from "../../../types/migration";
import { getDB } from "../config";
import { Category } from "../../../types/inventory";

const migration: Migration = {
	version: 2,
	name: "add_category_hierarchy",
	migrate: async () => {
		const db = await getDB();
		const tx = db.transaction("categories", "readwrite");
		const store = tx.objectStore("categories");

		const categories = await store.getAll();

		for (const category of categories) {
			const updatedCategory: Category = {
				...category,
				path: [],
				level: 0,
				isFolder: false,
				parentId: null,
			};

			await store.put(updatedCategory);
		}

		await tx.done;

		await db.put("migrations", {
			version: 2,
			timestamp: new Date(),
		});
	},
	rollback: async () => {
		const db = await getDB();
		const tx = db.transaction("categories", "readwrite");
		const store = tx.objectStore("categories");

		const categories = await store.getAll();

		for (const category of categories) {
			const { ...rollbackCategory } = category;
			await store.put({
				...rollbackCategory,
				isFolder: false,
				path: [],
				level: 0,
				parentId: null,
			} as Category);
		}

		await tx.done;
		await db.delete("migrations", 2);
	},
};

export default migration;
