import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const { Pool } = pg;

// Use available database connection
let connectionString: string;

const pghost = process.env.PGHOST;
const pgport = process.env.PGPORT;
const pguser = process.env.PGUSER;
const pgpassword = process.env.PGPASSWORD;
const pgdatabase = process.env.PGDATABASE;

// Check if all Replit vars are present and not Neon
const isReplitDatabase = pghost && pgport && pguser && pgpassword && pgdatabase && 
  !pghost.includes('neon') && !pghost.includes('ep-');

if (isReplitDatabase) {
  // Use Replit database
  connectionString = `postgresql://${pguser}:${pgpassword}@${pghost}:${pgport}/${pgdatabase}`;
} else if (process.env.DATABASE_URL) {
  // Fall back to DATABASE_URL
  connectionString = process.env.DATABASE_URL;
} else {
  throw new Error(
    "DATABASE_URL or PGHOST environment variables must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString });
export const db = drizzle({ client: pool, schema });
