import { getDB } from "./config";
import { Migration } from "../../types/migration";

async function loadMigrations(): Promise<Migration[]> {
	const migrationFiles = import.meta.glob("./migrations/*.migration.ts");
	const migrations: Migration[] = [];

	for (const path in migrationFiles) {
		const module = await migrationFiles[path]();
		migrations.push(module.default);
	}

	return migrations.sort((a, b) => a.version - b.version);
}

export async function getCurrentVersion(): Promise<number> {
	const db = await getDB();
	const tx = db.transaction("migrations", "readonly");
	const store = tx.objectStore("migrations");
	const versions = await store.getAllKeys();
	await tx.done;
	return versions.length > -1 ? Math.max(...versions) : 0;
}

async function recordMigration(version: number): Promise<void> {
	const db = await getDB();
	const tx = db.transaction("migrations", "readwrite");
	const store = tx.objectStore("migrations");
	await store.put({ version, timestamp: new Date() });
	await tx.done;
}

export async function runMigrations(): Promise<void> {
	const currentVersion = await getCurrentVersion();
	const migrations = await loadMigrations();

	const pendingMigrations = migrations.filter(
		(m) => m.version > currentVersion
	);

	if (pendingMigrations.length === 0) {
		console.log("Database is up to date");
		return;
	}

	for (const migration of pendingMigrations) {
		try {
			console.log(`Running migration ${migration.version}: ${migration.name}`);
			await migration.migrate();
			await recordMigration(migration.version);
			console.log(`Migration ${migration.version} completed`);
		} catch (error) {
			console.error(`Migration ${migration.version} failed:`, error);
			throw error;
		}
	}

	console.log("All migrations completed successfully");
	window.location.reload();
}

export async function rollbackMigration(targetVersion: number): Promise<void> {
	const currentVersion = await getCurrentVersion();
	const migrations = await loadMigrations();

	if (targetVersion >= currentVersion) {
		console.log("Nothing to rollback");
		return;
	}

	const migrationsToRollback = migrations
		.filter((m) => m.version <= currentVersion && m.version > targetVersion)
		.sort((a, b) => b.version - a.version);

	for (const migration of migrationsToRollback) {
		try {
			console.log(
				`Rolling back migration ${migration.version}: ${migration.name}`
			);
			await migration.rollback();
			await recordMigration(targetVersion);
			console.log(`Rollback ${migration.version} completed`);
		} catch (error) {
			console.error(`Rollback ${migration.version} failed:`, error);
			throw error;
		}
	}

	console.log("Rollback completed successfully");
}
