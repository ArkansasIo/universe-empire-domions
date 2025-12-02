import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const { Pool } = pg;

// Use DATABASE_URL if available (Neon), otherwise construct from individual Replit db env vars
let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  const pghost = process.env.PGHOST;
  const pgport = process.env.PGPORT;
  const pguser = process.env.PGUSER;
  const pgpassword = process.env.PGPASSWORD;
  const pgdatabase = process.env.PGDATABASE;
  
  if (!pghost || !pgport || !pguser || !pgpassword || !pgdatabase) {
    throw new Error(
      "DATABASE_URL or individual Postgres connection env vars (PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE) must be set. Did you forget to provision a database?",
    );
  }
  
  connectionString = `postgresql://${pguser}:${pgpassword}@${pghost}:${pgport}/${pgdatabase}`;
}

export const pool = new Pool({ connectionString });
export const db = drizzle({ client: pool, schema });
