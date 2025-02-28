
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Handler for debugging requests
export default async function handler(req, res) {
  try {
    // Basic environment info
    const info = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercel: Boolean(process.env.VERCEL),
      vercelRegion: process.env.VERCEL_REGION || "unknown",
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query,
      // List environment variables (excluding secrets)
      env: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_REGION: process.env.VERCEL_REGION,
        // Don't include DATABASE_URL or other secrets
        DATABASE_URL_EXISTS: Boolean(process.env.DATABASE_URL)
      },
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
    };

    // Try to connect to database if available
    if (process.env.DATABASE_URL) {
      try {
        const sql = neon(process.env.DATABASE_URL);
        const dbTest = await sql`SELECT 1 as connection_test;`;
        
        info.database = {
          connected: true,
          test: dbTest
        };
        
        // Check for tables
        const tablesCheck = await sql`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public';
        `;
        
        info.database.tables = tablesCheck.map(row => row.table_name);
      } catch (dbError) {
        info.database = {
          connected: false,
          error: dbError.message
        };
      }
    } else {
      info.database = {
        connected: false,
        error: "No DATABASE_URL provided"
      };
    }

    return res.status(200).json(info);
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return res.status(500).json({
      error: "Debug endpoint error",
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? "hidden" : error.stack,
    });
  }
}
