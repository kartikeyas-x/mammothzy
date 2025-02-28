
import { db } from "../db";
import { activities } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { InsertActivity } from "@shared/schema";

class Storage {
  async healthCheck() {
    try {
      // Simple query to check if database is responsive
      await db.select({ count: activities.id }).limit(1);
      return { status: "healthy", timestamp: new Date().toISOString() };
    } catch (error) {
      console.error("Database health check failed:", error);
      return { 
        status: "unhealthy", 
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async createActivity(activity: InsertActivity) {
    try {
      // Insert and return the created activity
      const result = await db.insert(activities).values(activity).returning();
      return result[0];
    } catch (error) {
      console.error("Failed to create activity:", error);
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async getAllActivities() {
    try {
      return await db.select().from(activities);
    } catch (error) {
      console.error("Failed to get all activities:", error);
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async getActivity(id: number) {
    try {
      const result = await db.select().from(activities).where(eq(activities.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error(`Failed to get activity with id ${id}:`, error);
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

export const storage = new Storage();
