export interface Migration {
	version: number;
	name: string;
	migrate: () => Promise<void>;
	rollback: () => Promise<void>;
}
