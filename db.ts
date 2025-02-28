
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./shared/schema";

// Create a database connection function
const createDBConnection = () => {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

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
