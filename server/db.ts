import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '@shared/schema';
import ws from 'ws';

// Configure WebSocket for Neon serverless
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export async function initializeDatabase() {
  console.log("Connecting to PostgreSQL database...");
  try {
    // Test the connection
    const { rows } = await pool.query('SELECT NOW()');
    console.log("Database connection established successfully");
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}