
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./shared/schema";
import dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config();

// Create a database connection function
const createDBConnection = () => {
  // Try to get from environment, otherwise use hardcoded fallback
  const connectionString = process.env.DATABASE_URL || 
    "postgresql://neondb_owner:npg_iswFG0ZaHIY5@ep-broad-mouse-a8asxfw4-pooler.eastus2.azure.neon.tech/neondb?sslmode=require";
  
  console.log("Using database connection:", connectionString.substring(0, 30) + "...");

  // Configure Neon database with proper pooling for serverless
  const sql = neon(connectionString, {
    pooling: {
      enabled: true,
      max: 5,            // Maximum 5 connections
      idleTimeoutMillis: 30000  // Close idle connections after 30 seconds
    }
  });

  return drizzle(sql, { schema });
};

// Export the database instance
export const db = createDBConnection();
