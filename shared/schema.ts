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
    category: categoryEnum.describe("Activity category"),
    activityType: activityTypeEnum.describe("Type of activity"),
    locationType: locationTypeEnum.describe("Location type"),
    minMembers: z.number().min(1, "Minimum members must be at least 1").optional(),
    maxMembers: z.number().min(1, "Maximum members must be at least 1").optional(),
    name: z.string().min(1, "Activity name is required").describe("Activity name"),
    description: z.string().min(10, "Description must be at least 10 characters long").describe("Activity description"),
    addressLine1: z.string().min(1, "Address line 1 is required").describe("Address line 1"),
    zipCode: z.string().min(1, "ZIP code is required").describe("ZIP code"),
    city: z.string().min(1, "City is required").describe("City"),
    state: z.string().min(1, "State is required").describe("State"),
    contactNumber: z.string().min(10, "Contact number must be at least 10 digits").describe("Contact number"),
    contactName: z.string().min(1, "Contact name is required").describe("Contact name"),
  })
  .superRefine((data, ctx) => {
    if (
      data.minMembers !== undefined &&
      data.maxMembers !== undefined &&
      data.maxMembers < data.minMembers
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum members must be greater than or equal to minimum members",
        path: ["maxMembers"],
      });
    }
  });

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;