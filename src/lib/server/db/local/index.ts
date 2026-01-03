import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '$lib/server/db/local/schema/index';
import { DATABASE_URL } from '$env/static/private';

export const local_db = (): ReturnType<typeof drizzle<typeof schema>> => {
   const client = new Database(DATABASE_URL);
   return drizzle(client, { schema });
}

