import { getDB, DB_NAME, initializeDB } from "./config";
import { Category, Item } from "../../types/inventory";
import { getCurrentVersion } from "./migrations";

// Helper functions
export const dbHelpers = {
	async initialize() {
		await initializeDB();
	},

	async deleteDatabase(): Promise<boolean> {
		try {
			// Close existing connection if any
			const db = await getDB();
			db.close();

			// Add a small delay to ensure the connection is fully closed
			await new Promise((resolve) => setTimeout(resolve, 100));

			// Return a promise that resolves when the database is deleted
			return new Promise((resolve) => {
				const deleteRequest = window.indexedDB.deleteDatabase(DB_NAME);

				deleteRequest.onerror = () => {
					console.error("Error deleting database");
					resolve(false);
				};

				deleteRequest.onblocked = () => {
					console.warn("Database deletion was blocked");
					resolve(false);
				};

				deleteRequest.onsuccess = () => {
					// Don't try to reinitialize immediately
					resolve(true);
				};
			});
		} catch (error) {
			console.error("Error in deleteDatabase:", error);
			return false;
		}
	},

	async exportData() {
		const db = await getDB();
		const currentVersion = await getCurrentVersion();

		const tx = db.transaction(
			["categories", "items", "migrations", "settings"],
			"readonly"
		);

		// Get all data including index information
		const categoriesStore = tx.objectStore("categories");
		const itemsStore = tx.objectStore("items");

		const categories = await categoriesStore.getAll();
		const items = await itemsStore.getAll();

		// Get indexed data
		const categoriesWithIndexes = await Promise.all(
			categories.map(async (category) => ({
				...category,
				byName: await categoriesStore.index("by-name").get(category.name),
				byUpdated: await categoriesStore
					.index("by-updated")
					.get(category.updatedAt),
			}))
		);

		const itemsWithIndexes = await Promise.all(
			items.map(async (item) => ({
				...item,
				byCategory: await itemsStore.index("by-category").get(item.categoryId),
				byName: await itemsStore.index("by-name").get(item.name),
				byUpdated: await itemsStore.index("by-updated").get(item.updatedAt),
			}))
		);

		const exportData = {
			version: currentVersion,
			timestamp: new Date().toISOString(),
			data: {
				categories: categoriesWithIndexes,
				items: itemsWithIndexes,
				migrations: await tx.objectStore("migrations").getAll(),
				settings: await tx.objectStore("settings").getAll(),
			},
		};

		await tx.done;
		return exportData;
	},

	async importData(
		importData: {
			version: number;
			timestamp: string;
			data: {
				categories: Category[];
				items: Item[];
				migrations: { version: number; timestamp: Date }[];
				settings: { key: string; timezone: string }[];
			};
		},
		options = { merge: false }
	) {
		const db = await getDB();
		const currentVersion = await getCurrentVersion();

		if (importData.version > currentVersion) {
			throw new Error(
				`Cannot import data from newer version (${importData.version}) into older database version (${currentVersion})`
			);
		}

		const tx = db.transaction(
			["categories", "items", "migrations", "settings"],
			"readwrite"
		);

		if (!options.merge) {
			// Clear all stores
			await Promise.all([
				tx.objectStore("categories").clear(),
				tx.objectStore("items").clear(),
				tx.objectStore("migrations").clear(),
				tx.objectStore("settings").clear(),
			]);

			// Import data (indexes will be automatically updated)
			const categoriesStore = tx.objectStore("categories");
			const itemsStore = tx.objectStore("items");

			await Promise.all([
				...importData.data.categories.map((categoryData) =>
					categoriesStore.add(categoryData)
				),
				...importData.data.items.map((itemData) => itemsStore.add(itemData)),
				...importData.data.migrations.map((migration) =>
					tx.objectStore("migrations").add(migration)
				),
				...importData.data.settings.map((setting) =>
					tx.objectStore("settings").add(setting)
				),
			]);
		} else {
			// Merge logic
			const importPromises = [];
			const categoriesStore = tx.objectStore("categories");
			const itemsStore = tx.objectStore("items");

			for (const categoryData of importData.data.categories) {
				const exists = await categoriesStore.get(categoryData.id);
				if (!exists) {
					importPromises.push(categoriesStore.add(categoryData));
				}
			}

			for (const itemData of importData.data.items) {
				const exists = await itemsStore.get(itemData.id);
				if (!exists) {
					importPromises.push(itemsStore.add(itemData));
				}
			}

			// Add migrations and settings
			importPromises.push(
				...importData.data.migrations.map(async (migration) => {
					const exists = await tx
						.objectStore("migrations")
						.get(migration.version);
					if (!exists) {
						return tx.objectStore("migrations").add(migration);
					}
				}),
				...importData.data.settings.map(async (setting) => {
					const exists = await tx.objectStore("settings").get(setting.key);
					if (!exists) {
						return tx.objectStore("settings").add(setting);
					}
				})
			);

			await Promise.all(importPromises);
		}

		await tx.done;
	},
};
