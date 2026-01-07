import type { Platform } from "../../../app";
import type { DBType } from "../../../types";
import { db } from "../db";
import type { SQLiteTable, TableConfig } from "drizzle-orm/sqlite-core";
import { eq } from "drizzle-orm";

export class RepositoryError extends Error {
    constructor(
        message: string,
        public readonly cause?: unknown
    ) {
        super(message);
        this.name = "RepositoryError";
    }
}

/**
 * Base repository class that all entity repos should extend.
 * Provides database access, platform context, and common CRUD operations.
 * 
 * TTable - The Drizzle table type
 * TInsert - The type for inserting (use table.$inferInsert)
 * TSelect - The type for selecting (use table.$inferSelect)
 */
export abstract class BaseRepository<
    TTable extends SQLiteTable<TableConfig>,
    TInsert = TTable["$inferInsert"],
    TSelect = TTable["$inferSelect"]
> {
    protected platform: Platform;
    protected db: DBType;
    protected abstract table: TTable;
    protected abstract idColumn: TTable["_"]["columns"][string];

    constructor(platform: Platform) {
        this.platform = platform;
        this.db = db({ platform: this.platform });
    }

    /**
     * Wrap operation with consistent error handling
     */
    protected async execute<T>(
        operation: string,
        fn: () => Promise<T>
    ): Promise<T> {
        try {
            return await fn();
        } catch (error) {
            console.error(`[${this.constructor.name}] ${operation} failed:`, error);
            throw new RepositoryError(`${operation} failed`, error);
        }
    }

    /**
     * Find all records
     */
    async findAll(): Promise<TSelect[]> {
        return this.execute("findAll", () =>
            this.db.select().from(this.table) as Promise<TSelect[]>
        );
    }

    /**
     * Find record by ID
     */
    async findById(id: string): Promise<TSelect | undefined> {
        return this.execute("findById", async () => {
            const results = await this.db
                .select()
                .from(this.table)
                .where(eq(this.idColumn, id));
            return results[0] as TSelect | undefined;
        });
    }

    /**
     * Create a new record
     */
    async create(data: TInsert): Promise<TSelect> {
        return this.execute("create", async () => {
            const results = await this.db
                .insert(this.table)
                .values(data as TTable["$inferInsert"])
                .returning();
            return results[0] as TSelect;
        });
    }

    /**
     * Update record by ID
     */
    async update(id: string, data: Partial<TInsert>): Promise<TSelect | undefined> {
        return this.execute("update", async () => {
            const results = await this.db
                .update(this.table)
                .set(data as Partial<TTable["$inferInsert"]>)
                .where(eq(this.idColumn, id))
                .returning();
            return results[0] as TSelect | undefined;
        });
    }

    /**
     * Delete record by ID
     */
    async delete(id: string): Promise<boolean> {
        return this.execute("delete", async () => {
            const results = await this.db
                .delete(this.table)
                .where(eq(this.idColumn, id))
                .returning();
            return results.length > 0;
        });
    }

    /**
     * Check if record exists
     */
    async exists(id: string): Promise<boolean> {
        const record = await this.findById(id);
        return record !== undefined;
    }

    /**
     * Count all records
     */
    async count(): Promise<number> {
        return this.execute("count", async () => {
            const results = await this.db.select().from(this.table);
            return results.length;
        });
    }
}