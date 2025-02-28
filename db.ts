
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./shared/schema";

// Database connection string
const connectionString = process.env.DATABASE_URL || "";

// Simple check to ensure we have a connection string
if (!connectionString) {
  console.error("DATABASE_URL environment variable is not set");
}

// Initialize postgres client
const client = postgres(connectionString, {
  max: 20,
  prepare: false,
});

// Initialize drizzle with the client and schema
export const db = drizzle(client, { schema });
