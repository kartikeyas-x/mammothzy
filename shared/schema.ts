import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  activityType: text("activity_type").notNull(),
  locationType: text("location_type").notNull(),
  minMembers: integer("min_members"),
  maxMembers: integer("max_members"),
  addressLine1: text("address_line_1").notNull(),
  addressLine2: text("address_line_2"),
  zipCode: text("zip_code").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  contactNumber: text("contact_number").notNull(),
  contactName: text("contact_name").notNull(),
});

const categoryEnum = z.enum([
  "Adventure & Games",
  "Creative Expression",
  "Food & Drink",
  "Learning & Development",
  "Sports and Fitness",
  "Volunteering",
  "Other"
]);

const activityTypeEnum = z.enum(["Indoor", "Outdoor", "Virtual"]);
const locationTypeEnum = z.enum(["Provider Location", "User Location"]);

export const insertActivitySchema = createInsertSchema(activities)
  .extend({
    category: categoryEnum,
    activityType: activityTypeEnum,
    locationType: locationTypeEnum,
    minMembers: z.number().min(1).optional(),
    maxMembers: z.number().min(1).optional(),
    contactNumber: z.string().min(10),
  });

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
