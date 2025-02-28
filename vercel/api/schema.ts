
import { z } from "zod";

// Define the schema for inserting a new activity
export const insertActivitySchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  type: z.enum(["work", "personal", "hobby", "other"]),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  due_date: z.string().optional(), // ISO date string format
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  created_by: z.string().optional(),
  assignee: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

// Define the schema for a complete activity, including system-generated fields
export const activitySchema = insertActivitySchema.extend({
  id: z.string(),
  created_at: z.string(), // ISO date string
  updated_at: z.string(), // ISO date string
});

// Define TypeScript types based on the schemas
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = z.infer<typeof activitySchema>;
