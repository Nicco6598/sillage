
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './db-schema';

const connectionString = process.env.DATABASE_URL!;

// Disable prefetch as it is not supported for "Transaction" pool mode which Supabase uses in transaction mode
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
// Force schema reload v2
