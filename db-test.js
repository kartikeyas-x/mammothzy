
// Simple database connection test
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

async function testConnection() {
  console.log('Starting database connection test...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in environment variables');
    return;
  }
  
  try {
    console.log('Connecting to database...');
    const sql = neon(process.env.DATABASE_URL);
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
