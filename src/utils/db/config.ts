import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Category, Item } from "../../types/inventory";
import { runMigrations } from "./migrations";

export interface InventoryDB extends DBSchema {
	categories: {
		key: string;
		value: Category;
		indexes: {
			"by-name": string;
			"by-updated": Date;
		};
	};
	items: {
		key: string;
		value: Item;
		indexes: {
			"by-category": string;
			"by-name": string;
			"by-updated": Date;
		};
	};
	migrations: {
		key: number;
		value: {
			version: number;
			timestamp: Date;
		};
	};
	settings: {
		key: string;
		value: {
			timezone: string;
		};
	};
}

export const DB_NAME = "home-inventory";
export const DB_VERSION = 5; // Start with the current version

export async function initializeDB(): Promise<IDBPDatabase<InventoryDB>> {
	const db = await openDB<InventoryDB>(DB_NAME, DB_VERSION, {
		upgrade(db, oldVersion, newVersion, transaction) {
			if (!db.objectStoreNames.contains("categories")) {
				const categoryStore = db.createObjectStore("categories", {
					keyPath: "id",
				});
				categoryStore.createIndex("by-name", "name");
			}

			if (!db.objectStoreNames.contains("items")) {
				const itemStore = db.createObjectStore("items", { keyPath: "id" });
				itemStore.createIndex("by-category", "categoryId");
				itemStore.createIndex("by-name", "name");
			}

			if (!db.objectStoreNames.contains("migrations")) {
				db.createObjectStore("migrations", { keyPath: "version" });
			}

			if (!db.objectStoreNames.contains("settings")) {
				db.createObjectStore("settings", { keyPath: "key" });
			}

			// Run migrations here
			runMigrations(db, oldVersion, newVersion, transaction);
		},
	});

	return db;
}

let dbInstance: IDBPDatabase<InventoryDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<InventoryDB>> {
	if (!dbInstance) {
		dbInstance = await initializeDB();
	}
	return dbInstance;
}
