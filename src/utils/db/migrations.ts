import { getDB } from './config';

interface Migration {
  version: number;
  name: string;
  migrate: () => Promise<void>;
  rollback: () => Promise<void>;
}

const migrations: Migration[] = [
  {
    version: 1,
    name: 'initial_schema',
    migrate: async () => {
      // Initial schema is created in config.ts
      const db = await getDB();
      await db.put('migrations', {
        version: 1,
        timestamp: new Date(),
      });
    },
    rollback: async () => {
      const db = await getDB();
      await db.delete('migrations', 1);
    },
  },
  // Add more migrations here as needed
];

export async function getCurrentVersion(): Promise<number> {
  const db = await getDB();
  const tx = db.transaction('migrations', 'readonly');
  const store = tx.objectStore('migrations');
  const versions = await store.getAllKeys();
  await tx.done;
  return versions.length > 0 ? Math.max(...versions) : 0;
}

export async function runMigrations(): Promise<void> {
  const currentVersion = await getCurrentVersion();
  
  const pendingMigrations = migrations
    .filter(m => m.version > currentVersion)
    .sort((a, b) => a.version - b.version);

  if (pendingMigrations.length === 0) {
    console.log('Database is up to date');
    return;
  }

  for (const migration of pendingMigrations) {
    try {
      console.log(`Running migration ${migration.version}: ${migration.name}`);
      await migration.migrate();
      console.log(`Migration ${migration.version} completed`);
    } catch (error) {
      console.error(`Migration ${migration.version} failed:`, error);
      throw error;
    }
  }

  console.log('All migrations completed successfully');
}

export async function rollbackMigration(targetVersion: number): Promise<void> {
  const currentVersion = await getCurrentVersion();
  
  if (targetVersion >= currentVersion) {
    console.log('Nothing to rollback');
    return;
  }

  const migrationsToRollback = migrations
    .filter(m => m.version <= currentVersion && m.version > targetVersion)
    .sort((a, b) => b.version - a.version);

  for (const migration of migrationsToRollback) {
    try {
      console.log(`Rolling back migration ${migration.version}: ${migration.name}`);
      await migration.rollback();
      console.log(`Rollback ${migration.version} completed`);
    } catch (error) {
      console.error(`Rollback ${migration.version} failed:`, error);
      throw error;
    }
  }

  console.log('Rollback completed successfully');
} 