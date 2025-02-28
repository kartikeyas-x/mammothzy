
// A simple script to verify database connection
import dotenv from "dotenv";
import { storage } from './server/storage.js';

// Load environment variables
dotenv.config();

// If DATABASE_URL is not set, use the provided connection string
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://neondb_owner:npg_iswFG0ZaHIY5@ep-broad-mouse-a8asxfw4-pooler.eastus2.azure.neon.tech/neondb?sslmode=require";
  console.log("Using provided connection string");
}

// Check for NODE_ENV
const nodeEnv = process.env.NODE_ENV || 'development';
console.log(`Current environment: ${nodeEnv}`);
console.log(`Database URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Not set'}`);

// Simple health check
async function main() {
  try {
    console.log('Testing database connection...');
    
    // Basic connection test
    const result = await storage.healthCheck();
    console.log('Database status:', result);
    
    if (result.status === 'healthy') {
      console.log('✅ Database connection successful!');
    } else {
      console.error('❌ Database connection failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error testing database:', error);
    console.error(error);
  } finally {
    // Force exit after completion (to avoid hanging connections)
    process.exit(0);
  }
}

main();
