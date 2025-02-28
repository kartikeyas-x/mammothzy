import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "../../server/routes"; 
import { serveStatic, log } from "../../server/vite";  
import serverless from "serverless-http";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create an instance of your Express app
const app = express();

// Middleware: parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Example middleware for logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Register your API routes (wrapped in async IIFE)
(async () => {
  try {
    await registerRoutes(app);
  } catch (error) {
    console.error("Failed to register routes:", error);
  }
})();

// Serve static files (only in production; adjust if needed)
if (process.env.NODE_ENV !== "development") {
  serveStatic(app);
}

// Export the handler for Vercel
export default serverless(app);