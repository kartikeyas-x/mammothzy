
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  try {
    // Check database connection
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return res.status(500).json({ 
        status: "unhealthy", 
        error: "No DATABASE_URL environment variable found"
      });
    }
    
    const sql = neon(connectionString);
    
    // Basic database check
    await sql`SELECT 1 as connection_test;`;
    
    // Return successful healthcheck
    return res.status(200).json({
      status: "healthy",
      environment: process.env.NODE_ENV || "development",
      vercel: process.env.VERCEL ? true : false,
      region: process.env.VERCEL_REGION || "unknown",
      timestamp: new Date().toISOString(),
      message: "API is operational"
    });
  } catch (error) {
    console.error("Healthcheck failed:", error);
    return res.status(500).json({
      status: "unhealthy",
      error: error.message,
      stack: process.env.NODE_ENV === "production" ? "hidden" : error.stack,
      timestamp: new Date().toISOString()
    });
  }
}
