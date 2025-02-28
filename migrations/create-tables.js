
// Migration script to create the activities table
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { activities } from "../shared/schema";
import { sql } from "drizzle-orm";

// Load environment variables
dotenv.config();

async function runMigration() {
  console.log('Starting database migration...');
  
  const connectionString = process.env.DATABASE_URL || 
    "postgresql://neondb_owner:npg_iswFG0ZaHIY5@ep-broad-mouse-a8asxfw4-pooler.eastus2.azure.neon.tech/neondb?sslmode=require";
  
  try {
    console.log('Connecting to database for migration...');
    const sql = neon(connectionString);
    const db = drizzle(sql);
    
    console.log('Creating activities table...');
    await sql`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        activity_type TEXT NOT NULL,
        location_type TEXT NOT NULL,
        min_members INTEGER,
        max_members INTEGER,
        address_line_1 TEXT NOT NULL,
        address_line_2 TEXT,
        zip_code TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        contact_number TEXT NOT NULL,
        contact_name TEXT NOT NULL
      )
    `;
    
    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:');
    console.error(error);
  }
}

runMigration();
