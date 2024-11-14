// src/migrations/003_add_updated_index.migration.ts
import { Migration } from "../../../types/migration";
import { getDB } from "../config";
import { IDBPDatabase, openDB } from "idb";

const migration: Migration = {
	version: 3,
	name: "add_updated_index",
	migrate: async () => {
		const db = await getDB();
		// Need to use onupgradeneeded to create/modify indexes
		if (!db.version) {
			db.close();
			const upgradedDB = await openDB("inventory", 3, {
				upgrade(db: IDBPDatabase<unknown>) {
					// Create stores if they don't exist
					if (!db.objectStoreNames.contains("categories")) {
						db.createObjectStore("categories");
					}
					if (!db.objectStoreNames.contains("items")) {
						db.createObjectStore("items");
					}

					const categoryStore = db
						.transaction("categories", "readwrite")
						.objectStore("categories");
					const itemStore = db
						.transaction("items", "readwrite")
						.objectStore("items");

					// Type assertion since we know we're in an upgrade transaction
					if (!categoryStore.indexNames.contains("by-updated")) {
						(categoryStore as unknown as IDBObjectStore).createIndex(
							"by-updated",
							"updatedAt"
						);
					}

					if (!itemStore.indexNames.contains("by-updated")) {
						(itemStore as unknown as IDBObjectStore).createIndex(
							"by-updated",
							"updatedAt"
						);
					}
				},
			});
			upgradedDB.close();
		}

		await db.put("migrations", {
			version: 3,
			timestamp: new Date(),
		});
	},
	rollback: async () => {
		const db = await getDB();
		// Need to use onupgradeneeded to remove indexes
		if (!db.version) {
			db.close();
			const upgradedDB = await openDB("inventory", 2, {
				upgrade(db: IDBPDatabase<unknown>) {
					const categoryStore = db
						.transaction("categories", "readwrite")
						.objectStore("categories");
					const itemStore = db
						.transaction("items", "readwrite")
						.objectStore("items");

					if (categoryStore.indexNames.contains("by-updated")) {
						(categoryStore as unknown as IDBObjectStore).deleteIndex(
							"by-updated"
						);
					}

					if (itemStore.indexNames.contains("by-updated")) {
						(itemStore as unknown as IDBObjectStore).deleteIndex("by-updated");
					}
				},
			});
			upgradedDB.close();
		}

		await db.delete("migrations", 3);
	},
};

export default migration;
