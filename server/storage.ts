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
      // Set default values for required fields if they're missing
      const activityWithDefaults = {
        ...activity,
        activity_type: activity.activity_type || "Indoor", // Default to Indoor if not specified
        location_type: activity.location_type || "In-person", // Default to In-person if not specified
        address_line_1: activity.address_line_1 || "N/A", // Default for the not-null constraint
        zip_code: activity.zip_code || "00000", // Default for the not-null constraint
        contact_number: activity.contact_number || "000-000-0000", // Default for the not-null constraint
        contact_name: activity.contact_name || "Default Contact", // Default for the not-null constraint
        description: activity.description || "No description provided", // Default for the not-null constraint
        city: activity.city || "Default City", // Default for the not-null constraint
        state: activity.state || "Default State", // Default for the not-null constraint
      };
      
      console.log("Creating activity with defaults:", JSON.stringify(activityWithDefaults));
      
      const result = await db.insert(activities).values(activityWithDefaults).returning();
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