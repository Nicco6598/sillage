
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './db-schema';

const connectionString = process.env.DATABASE_URL!;

// Debug logging for build errors
if (!connectionString) {
  console.error("❌ DATABASE_URL is missing in environment variables!");
} else {
  try {
    const url = new URL(connectionString);
    console.log(`🔌 Connecting to DB at ${url.hostname} (User: ${url.username})`);
  } catch (e) {
    console.error("❌ DATABASE_URL is not a valid URL format");
  }
}

// Disable prefetch as it is not supported for "Transaction" pool mode which Supabase uses in transaction mode
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
// Force schema reload v2
