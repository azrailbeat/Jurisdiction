import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../shared/schema';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create a Drizzle ORM instance with the connection pool
export const db = drizzle(pool, { schema });

// Function to initialize the database (create tables if they don't exist)
export async function initializeDatabase() {
  try {
    console.log('Connecting to PostgreSQL database...');
    
    // Test the connection
    const client = await pool.connect();
    console.log('Database connection established successfully');
    client.release();
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}