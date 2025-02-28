import { z } from "zod";

// Define the schema for inserting a new activity
export const insertActivitySchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  type: z.enum(["Work", "Personal", "Study", "Exercise", "Other"]),
  duration: z.number().int().positive(),
  date: z.string().datetime(),
  completed: z.boolean().default(false),
});

// Define the schema for an activity with an ID
export const activitySchema = insertActivitySchema.extend({
  id: z.number().int().positive(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// TypeScript types derived from the schemas
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = z.infer<typeof activitySchema>;