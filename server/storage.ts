import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { activities, type InsertActivity } from "@shared/schema";
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Create a pool connection for better serverless performance
const createDBConnection = () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is not set");
    throw new Error("DATABASE_URL environment variable is not set");
  }
  console.log("Database URL found, attempting connection...");
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);
  return db;
};

export const db = createDBConnection();