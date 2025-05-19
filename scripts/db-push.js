import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure WebSocket for Neon serverless
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not defined");
  process.exit(1);
}

console.log("Running database migrations...");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

try {
  migrate(db, { migrationsFolder: 'drizzle' });
  console.log("Migrations completed successfully");
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
}