// src/migrations/002_add_category_hierarchy.migration.ts
import { Migration } from "../../../types/migration";
import { getDB } from "../config";

const migration: Migration = {
	version: 2,
	name: "add_category_hierarchy",
	migrate: async () => {
		const db = await getDB();
		const tx = db.transaction("categories", "readwrite");
		const store = tx.objectStore("categories");

		const categories = await store.getAll();

		for (const category of categories) {
			const updatedCategory = {
				...category,
				path: [],
				level: 0,
				isFolder: true,
				parentId: undefined,
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
			const { path, level, isFolder, parentId, ...rollbackCategory } = category;
			await store.put(rollbackCategory);
		}

		await tx.done;
		await db.delete("migrations", 2);
	},
};

export default migration;
