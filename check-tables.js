
// Script to check if the activities table exists
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function checkTables() {
  console.log('Checking database tables...');
  
  const connectionString = process.env.DATABASE_URL || 
    "postgresql://neondb_owner:npg_iswFG0ZaHIY5@ep-broad-mouse-a8asxfw4-pooler.eastus2.azure.neon.tech/neondb?sslmode=require";
  
  try {
    console.log('Connecting to database...');
    const sql = neon(connectionString);
    
    // Check if activities table exists
    const tableResult = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'activities'
      );
    `;
    
    const tableExists = tableResult[0].exists;
    console.log(`Activities table exists: ${tableExists ? 'YES' : 'NO'}`);
    
    if (tableExists) {
      // List columns in the table
      const columnResult = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'activities';
      `;
      
      console.log('Table columns:');
      columnResult.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Database check failed:');
    console.error(error);
  }
}

checkTables();
