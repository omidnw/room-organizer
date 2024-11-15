// src/migrations/000_initial_setup.migration.ts
import { Migration } from "../../../types/migration";
import { getDB } from "../config";
import { categoryOperations } from "../operations";

const migration: Migration = {
	version: 0,
	name: "initial_setup",
	migrate: async () => {
		// Create main storage folders
		const storage = await categoryOperations.create({
			name: "Storage",
			color: "#3B82F6",
			description: "Main storage areas",
			isFolder: true,
		});

		const furniture = await categoryOperations.create({
			name: "Furniture",
			color: "#10B981",
			description: "Furniture storage",
			isFolder: true,
		});

		// Add subcategories
		await Promise.all([
			// Storage subcategories
			categoryOperations.create({
				name: "Storage Boxes",
				color: "#F97316",
				description: "Items in storage boxes",
				parentId: storage.id,
				isFolder: false,
			}),
			categoryOperations.create({
				name: "Wall Shelves",
				color: "#14B8A6",
				description: "Items on wall-mounted shelves",
				parentId: storage.id,
				isFolder: false,
			}),

			// Furniture subcategories
			categoryOperations.create({
				name: "Desk Drawers",
				color: "#10B981",
				description: "Items in desk drawers",
				parentId: furniture.id,
				isFolder: false,
			}),
			categoryOperations.create({
				name: "Wardrobe",
				color: "#F59E0B",
				description: "Clothes and items in wardrobe",
				parentId: furniture.id,
				isFolder: false,
			}),
			categoryOperations.create({
				name: "Bedside Cabinet",
				color: "#8B5CF6",
				description: "Items in bedside drawers",
				parentId: furniture.id,
				isFolder: false,
			}),
			categoryOperations.create({
				name: "Under-bed Storage",
				color: "#EC4899",
				description: "Items stored under the bed",
				parentId: furniture.id,
				isFolder: false,
			}),
		]);

		const db = await getDB();
		await db.put("migrations", {
			version: 0,
			timestamp: new Date(),
		});
	},
	rollback: async () => {
		const db = await getDB();
		const categories = await categoryOperations.getAll();

		for (const category of categories) {
			await categoryOperations.delete(category.id);
		}

		await db.delete("migrations", 0);
	},
};

export default migration;
