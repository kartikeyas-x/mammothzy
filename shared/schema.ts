
import { z } from "zod";
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

// Define the database table
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  activity_type: text("activity_type"),
  location_type: text("location_type"),
  min_members: integer("min_members").default(1),
  max_members: integer("max_members").default(1),
  address_line_1: text("address_line_1"),
  address_line_2: text("address_line_2"),
  zip_code: text("zip_code"),
  city: text("city"),
  state: text("state"),
  contact_number: text("contact_number"),
  contact_name: text("contact_name"),
});

// Define the schema for creating a new activity
export const insertActivitySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  description: z.string().optional(),
  activity_type: z.string().optional(),
  location_type: z.string().optional(),
  min_members: z.number().int().positive().optional().default(1),
  max_members: z.number().int().positive().optional().default(1),
  address_line_1: z.string().optional(),
  address_line_2: z.string().optional(),
  zip_code: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  contact_number: z.string().optional(),
  contact_name: z.string().optional(),
});

// Define the schema for an activity with an ID
export const activitySchema = insertActivitySchema.extend({
  id: z.number().int().positive(),
});

// Type definitions based on the schemas
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = z.infer<typeof activitySchema>;
