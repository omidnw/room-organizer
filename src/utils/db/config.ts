import { openDB, DBSchema, IDBPDatabase, IDBPObjectStore } from "idb";
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

type StoreNames = "categories" | "items" | "migrations" | "settings";
type IndexNames<T extends StoreNames> = T extends keyof InventoryDB
	? InventoryDB[T] extends { indexes: Record<string, unknown> }
		? keyof InventoryDB[T]["indexes"]
		: never
	: never;

function createIndex<T extends StoreNames>(
	store: IDBPObjectStore<
		InventoryDB,
		ArrayLike<StoreNames>,
		T,
		"versionchange"
	>,
	indexName: IndexNames<T>,
	keyPath: string | string[],
	options?: IDBIndexParameters
) {
	store.createIndex(indexName, keyPath, options);
}

export const DB_NAME = "home-inventory";
export const DB_VERSION = 1; // Start with the current version

export async function initializeDB(): Promise<IDBPDatabase<InventoryDB>> {
	const db = await openDB<InventoryDB>(DB_NAME, DB_VERSION, {
		upgrade(db, oldVersion, newVersion, transaction) {
			if (!db.objectStoreNames.contains("categories")) {
				const categoryStore = db.createObjectStore("categories", {
					keyPath: "id",
				});
				createIndex(categoryStore, "by-name", "name");
				createIndex(categoryStore, "by-updated", "updatedAt");
			}

			if (!db.objectStoreNames.contains("items")) {
				const itemStore = db.createObjectStore("items", { keyPath: "id" });
				createIndex(itemStore, "by-category", "categoryId");
				createIndex(itemStore, "by-name", "name");
				createIndex(itemStore, "by-updated", "updatedAt");
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
	if (!dbInstance || !dbInstance.objectStoreNames.length) {
		dbInstance = await initializeDB();
	}
	return dbInstance;
}
