import Database from 'better-sqlite3';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import * as schemaLocal from "../shared/schema-local.js";

// Use SQLite for local development
const sqlite = new Database('./local.db');
export const db = drizzleSqlite(sqlite, { schema: schemaLocal });
