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
const databaseUrl = process.env.DATABASE_URL;

// Determine if DATABASE_URL is a disabled Neon endpoint
const isDisabledNeon = databaseUrl && (databaseUrl.includes('neon') || databaseUrl.includes('ep-divine-block'));

// Check if we have valid individual Postgres vars
const hasValidPgVars = pghost && pgport && pguser && pgpassword && pgdatabase && 
  !pghost.includes('neon') && !pghost.includes('ep-');

if (hasValidPgVars) {
  // Prefer individual Replit database vars
  connectionString = `postgresql://${pguser}:${pgpassword}@${pghost}:${pgport}/${pgdatabase}`;
  console.log(`🗄️ Using Replit PostgreSQL: ${pghost}`);
} else if (databaseUrl && !isDisabledNeon) {
  // Use DATABASE_URL only if it's not a disabled Neon endpoint
  connectionString = databaseUrl;
  console.log('🗄️ Using DATABASE_URL');
} else {
  // DATABASE_URL points to disabled Neon - create a local fallback
  console.warn('⚠️ DATABASE_URL points to disabled Neon. Using in-memory fallback.');
  throw new Error(
    "No valid database connection available. Please ensure Replit PostgreSQL database is set up.",
  );
}

export const pool = new Pool({ connectionString });
export const db = drizzle({ client: pool, schema });
