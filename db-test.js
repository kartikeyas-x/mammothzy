// Simple database connection test
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

async function testConnection() {
  console.log('Starting database connection test...');

  // If DATABASE_URL is not in env, use the provided connection string directly
  const connectionString = process.env.DATABASE_URL || 
    "postgresql://neondb_owner:npg_iswFG0ZaHIY5@ep-broad-mouse-a8asxfw4-pooler.eastus2.azure.neon.tech/neondb?sslmode=require";

  try {
    console.log('Connecting to database...');
    const sql = neon(connectionString);
    const db = drizzle(sql);

    // Simple query that should work on any PostgreSQL database
    const result = await sql`SELECT 1 AS test`;
    console.log('✅ Database connection successful!');
    console.log('Query result:', result);

  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
  }
}

testConnection();