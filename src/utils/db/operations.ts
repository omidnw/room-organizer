import { v4 as uuidv4 } from 'uuid';
import { getDB } from './config';
import { Category, Item } from '../../types/inventory';

// Category Operations
export const categoryOperations = {
  async create(category: Omit<Category, 'id'>): Promise<Category> {
    const db = await getDB();
    const id = uuidv4();
    const newCategory = {
      id,
      ...category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.add('categories', newCategory);
    return newCategory;
  },

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const db = await getDB();
    const category = await db.get('categories', id);
    if (!category) throw new Error('Category not found');

    const updatedCategory = {
      ...category,
      ...data,
      updatedAt: new Date(),
    };
    await db.put('categories', updatedCategory);
    return updatedCategory;
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('categories', id);
  },

  async getById(id: string): Promise<Category | undefined> {
    const db = await getDB();
    return db.get('categories', id);
  },

  async getAll(): Promise<Category[]> {
    const db = await getDB();
    return db.getAllFromIndex('categories', 'by-name');
  },
};

// Item Operations
export const itemOperations = {
  async create(item: Omit<Item, 'id'>): Promise<Item> {
    const db = await getDB();
    const id = uuidv4();
    const newItem = {
      id,
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.add('items', newItem);
    return newItem;
  },

  async update(id: string, data: Partial<Item>): Promise<Item> {
    const db = await getDB();
    const item = await db.get('items', id);
    if (!item) throw new Error('Item not found');

    const updatedItem = {
      ...item,
      ...data,
      updatedAt: new Date(),
    };
    await db.put('items', updatedItem);
    return updatedItem;
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('items', id);
  },

  async getById(id: string): Promise<Item | undefined> {
    const db = await getDB();
    return db.get('items', id);
  },

  async getAll(): Promise<Item[]> {
    const db = await getDB();
    return db.getAllFromIndex('items', 'by-name');
  },

  async getByCategory(categoryId: string): Promise<Item[]> {
    const db = await getDB();
    return db.getAllFromIndex('items', 'by-category', categoryId);
  },

  async search(query: string): Promise<Item[]> {
    const db = await getDB();
    const allItems = await db.getAllFromIndex('items', 'by-name');
    const searchLower = query.toLowerCase();
    return allItems.filter(item => 
      item.name.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower)
    );
  },
};

// Helper functions
export const dbHelpers = {
  async initialize() {
    const db = await getDB();
    const categories = await categoryOperations.getAll();
    
    if (categories.length === 0) {
      // Add default categories
      await Promise.all([
        categoryOperations.create({ 
          name: 'Electronics',
          color: '#3B82F6',
          description: 'Electronic devices and gadgets'
        }),
        categoryOperations.create({ 
          name: 'Furniture',
          color: '#10B981',
          description: 'Home and office furniture'
        }),
        categoryOperations.create({ 
          name: 'Kitchen',
          color: '#F59E0B',
          description: 'Kitchen appliances and utensils'
        }),
        categoryOperations.create({ 
          name: 'Books',
          color: '#8B5CF6',
          description: 'Books and publications'
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
    const tx = db.transaction(['categories', 'items'], 'readwrite');
    
    await Promise.all([
      ...data.categories.map(cat => tx.store.add(cat)),
      ...data.items.map(item => tx.objectStore('items').add(item)),
    ]);

    await tx.done;
  },
}; 