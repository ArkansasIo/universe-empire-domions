import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const { Pool } = pg;

// Prefer Replit individual env vars over DATABASE_URL (which might be disabled Neon)
let connectionString: string;

const pghost = process.env.PGHOST;
const pgport = process.env.PGPORT;
const pguser = process.env.PGUSER;
const pgpassword = process.env.PGPASSWORD;
const pgdatabase = process.env.PGDATABASE;

// Check if all Replit vars are present and PGHOST is not Neon
const isReplitDatabase = pghost && pgport && pguser && pgpassword && pgdatabase && 
  !pghost.includes('neon') && !pghost.includes('ep-');

if (isReplitDatabase) {
  // Use Replit database
  connectionString = `postgresql://${pguser}:${pgpassword}@${pghost}:${pgport}/${pgdatabase}`;
  console.log(`🗄️ Connecting to Replit PostgreSQL database at ${pghost}`);
} else if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('neon')) {
  // Fall back to DATABASE_URL if it's not a disabled Neon endpoint
  connectionString = process.env.DATABASE_URL;
  console.log('🗄️ Connecting to DATABASE_URL');
} else {
  throw new Error(
    "Unable to find valid database connection. Ensure Replit PostgreSQL database is set up or provide a valid DATABASE_URL.",
  );
}

export const pool = new Pool({ connectionString });
export const db = drizzle({ client: pool, schema });
