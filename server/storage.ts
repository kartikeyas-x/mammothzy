import { db } from "../db";
import { activities } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { InsertActivity, Activity } from "@shared/schema"; // Assuming Activity type is defined elsewhere

class Storage {
  async healthCheck() {
    try {
      // Test basic connection
      const result = await db.execute(db.sql`SELECT 1 as test`);

      // Check if activities table exists
      const tableCheck = await db.execute(db.sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'activities'
        );
      `);

      const tableExists = tableCheck[0]?.exists === true;

      return { 
        status: tableExists ? "healthy" : "warning", 
        message: tableExists 
          ? "Database connection and schema are healthy" 
          : "Database connected but activities table does not exist",
        connection: "successful",
        schema: tableExists ? "complete" : "missing",
        tables: {
          activities: tableExists
        }
      };
    } catch (error) {
      return { 
        status: "unhealthy", 
        message: "Database connection failed", 
        error: error.message,
        connection: "failed" 
      };
    }
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    try {
      const result = await db.insert(activities).values(activity).returning();
      return result[0];
    } catch (error) {
      console.error("Failed to create activity:", error);

      // Check if this is a "relation does not exist" error
      if (error.code === '42P01') {
        console.error("Table 'activities' does not exist. Try redeploying or running migrations.");
        throw new Error(`Database error: The activities table does not exist. Please ensure migrations have been run.`);
      }

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