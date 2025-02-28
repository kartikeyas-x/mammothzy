
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  try {
    // Check database connection if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      await sql`SELECT 1 as connection_test`;
    }
    
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
      timestamp: new Date().toISOString()
    });
  }
}
