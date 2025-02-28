
import express, { Request, Response } from "express";
import serverless from "serverless-http";
import { neon } from "@neondatabase/serverless";
import { insertActivitySchema } from "../../shared/schema";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Root endpoint
app.get("/api", (req: Request, res: Response) => {
  res.json({
    message: "API is running",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'unknown'
  });
});

// Activities endpoints
app.post("/api/activities", async (req: Request, res: Response) => {
  try {
    // Validate input using zod schema
    const activity = insertActivitySchema.parse(req.body);
    console.log("Activity data received:", JSON.stringify(activity));
    
    // Connect to database
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Insert activity with simple SQL to avoid dependencies
    const result = await sql`
      INSERT INTO activities (
        name, category, description, activity_type, location_type, 
        min_members, max_members, address_line_1, address_line_2, 
        zip_code, city, state, contact_number, contact_name
      ) VALUES (
        ${activity.name}, ${activity.category}, ${activity.description}, 
        ${activity.activity_type}, ${activity.location_type}, 
        ${activity.min_members}, ${activity.max_members}, 
        ${activity.address_line_1}, ${activity.address_line_2}, 
        ${activity.zip_code}, ${activity.city}, ${activity.state}, 
        ${activity.contact_number}, ${activity.contact_name}
      ) RETURNING *
    `;
    
    // Return created activity
    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Error creating activity:", error);
    
    if (error.name === "ZodError") {
      return res.status(400).json({ 
        error: "Invalid activity data", 
        details: error.errors 
      });
    }
    
    res.status(500).json({ 
      error: "Failed to create activity", 
      message: process.env.NODE_ENV === 'production' ? null : error.message 
    });
  }
});

app.get("/api/activities", async (req: Request, res: Response) => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    
    const sql = neon(process.env.DATABASE_URL);
    const activities = await sql`SELECT * FROM activities`;
    
    res.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ 
      error: "Failed to fetch activities",
      message: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Export serverless handler
export default serverless(app);
