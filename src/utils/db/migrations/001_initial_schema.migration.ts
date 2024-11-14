// src/migrations/001_initial_schema.migration.ts
import { Migration } from "../../../types/migration";
import { getDB } from "../config";

const migration: Migration = {
	version: 1,
	name: "initial_schema",
	migrate: async () => {
		const db = await getDB();
		await db.put("migrations", {
			version: 1,
			timestamp: new Date(),
		});
	},
	rollback: async () => {
		const db = await getDB();
		await db.delete("migrations", 1);
	},
};

export default migration;
