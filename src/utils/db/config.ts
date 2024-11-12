import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface InventoryDB extends DBSchema {
  categories: {
    key: string;
    value: {
      id: string;
      name: string;
      description?: string;
      color?: string;
      createdAt: Date;
      updatedAt: Date;
    };
    indexes: { 'by-name': string };
  };
  items: {
    key: string;
    value: {
      id: string;
      name: string;
      description?: string;
      categoryId: string;
      quantity: number;
      price: number;
      purchaseDate: string;
      image?: string;
      notes?: string;
      createdAt: Date;
      updatedAt: Date;
    };
    indexes: { 'by-category': string; 'by-name': string };
  };
  migrations: {
    key: number;
    value: {
      version: number;
      timestamp: Date;
    };
  };
}

export const DB_NAME = 'home-inventory';
export const DB_VERSION = 1;

export async function initializeDB(): Promise<IDBPDatabase<InventoryDB>> {
  const db = await openDB<InventoryDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      // Categories store
      if (!db.objectStoreNames.contains('categories')) {
        const categoryStore = db.createObjectStore('categories', { keyPath: 'id' });
        categoryStore.createIndex('by-name', 'name');
      }

      // Items store
      if (!db.objectStoreNames.contains('items')) {
        const itemStore = db.createObjectStore('items', { keyPath: 'id' });
        itemStore.createIndex('by-category', 'categoryId');
        itemStore.createIndex('by-name', 'name');
      }

      // Migrations store
      if (!db.objectStoreNames.contains('migrations')) {
        db.createObjectStore('migrations', { keyPath: 'version' });
      }
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