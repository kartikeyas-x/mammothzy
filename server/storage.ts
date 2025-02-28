import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { activities, type InsertActivity } from "@shared/schema";

// Function to get database connection
// This pattern works better in serverless environments where connections might need to be reestablished
const getDB = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Configure database with pooling for better performance in serverless
  const sql = neon(process.env.DATABASE_URL, { 
    pooling: true,
    connectionString: process.env.DATABASE_URL
  });

  return drizzle(sql);
};

export const storage = {
  async createActivity(activity: InsertActivity) {
    try {
      const db = getDB();
      const [created] = await db.insert(activities).values(activity).returning();
      return created;
    } catch (error) {
      console.error("Error creating activity:", error);
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
};