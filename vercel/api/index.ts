import serverless from 'serverless-http';
import express from 'express';
import { registerRoutes } from '../../server/routes';
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../../shared/schema";

// Load environment variables
dotenv.config();

// Create an Express app
const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

// Function to ensure database tables exist
async function ensureTablesExist() {
  try {
    console.log("Checking/creating database tables...");
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      console.error("ERROR: No DATABASE_URL environment variable found");
      return false;
    }

    const sql = neon(connectionString);
    const db = drizzle(sql, { schema });

    // Check if activities table exists
    const tableResult = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'activities'
      );
    `;

    const tableExists = tableResult[0]?.exists;
    console.log(`Activities table exists: ${tableExists ? 'YES' : 'NO'}`);

    // Create table if it doesn't exist
    if (!tableExists) {
      console.log("Creating activities table...");
      await sql`
        CREATE TABLE IF NOT EXISTS "activities" (
          "id" SERIAL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      console.log("Activities table created successfully");
      return true;
    }

    return true;
  } catch (error) {
    console.error("Database initialization error:", error);
    return false;
  }
}

// Initialize database tables before handling requests
ensureTablesExist().then(success => {
  console.log(`Database initialization ${success ? 'successful' : 'failed'}`);
});

// Debug endpoint to verify database connection
app.get("/api/debug-db", async (req, res) => {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return res.status(500).json({ error: "No DATABASE_URL environment variable found" });
    }

    const sql = neon(connectionString);

    // Check database connection
    const result = await sql`SELECT 1 as connection_test;`;

    // Check if activities table exists
    const tableResult = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'activities'
      );
    `;

    return res.status(200).json({
      connection: "successful",
      connectionTest: result,
      tableExists: tableResult[0]?.exists || false,
      environment: process.env.NODE_ENV,
      vercel: true
    });
  } catch (error) {
    console.error("Database debug error:", error);
    return res.status(500).json({
      error: "Database connection error",
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? "hidden" : error.stack
    });
  }
});

// Fallback route for checking API health
app.get("/api/ping", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running",
    timestamp: new Date().toISOString()
  });
});


// Register API routes
registerRoutes(app).then(() => {
  console.log("API routes registered");
}).catch(err => {
  console.error("Failed to register API routes:", err);
});

// Export the serverless function
export default serverless(app);