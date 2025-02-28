
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { activities, type InsertActivity } from "@shared/schema";

// Create a pool connection for better serverless performance
const createDBConnection = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Configure Neon database with proper pooling for serverless
  const sql = neon(process.env.DATABASE_URL, {
    pooling: {
      enabled: true,
      max: 5,            // Maximum 5 connections
      idleTimeoutMillis: 30000  // Close idle connections after 30 seconds
    }
  });

  return drizzle(sql);
};

// Global connection that gets initialized on first use
let db;

// Get database instance with lazy initialization
const getDB = () => {
  if (!db) {
    db = createDBConnection();
    console.log("Database connection initialized");
  }
  return db;
};

export const storage = {
  async createActivity(activity: InsertActivity) {
    try {
      const db = getDB();
      console.log("Creating activity:", JSON.stringify(activity));
      const [created] = await db.insert(activities).values(activity).returning();
      return created;
    } catch (error) {
      console.error("Error creating activity:", error);
      // Add more specific error handling
      if (error.message?.includes("connection")) {
        throw new Error("Database connection error: " + error.message);
      }
      throw error;
    }
  },

  async getAllActivities() {
    try {
      const db = getDB();
      return await db.select().from(activities).orderBy(activities.createdAt);
    } catch (error) {
      console.error("Error getting activities:", error);
      throw error;
    }
  },

  async getActivity(id: number) {
    try {
      const db = getDB();
      const [activity] = await db
        .select()
        .from(activities)
        .where(activities.id === id);
      return activity;
    } catch (error) {
      console.error(`Error getting activity ${id}:`, error);
      throw error;
    }
  },
  
  // Add a health check method for the database
  async healthCheck() {
    try {
      const db = getDB();
      // Simple query to check database connectivity
      await db.select({ count: activities.id }).limit(1);
      return { status: "healthy" };
    } catch (error) {
      console.error("Database health check failed:", error);
      return { 
        status: "unhealthy", 
        error: error.message,
        details: error.stack
      };
    }
  }
};
