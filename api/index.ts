// File: api/index.ts

import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes"; // Your existing API routes
import { serveStatic, log } from "../server/vite";   // Your static serving and logging functions
import serverless from "serverless-http";

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

// Register your API routes
await registerRoutes(app);

// Serve static files (only in production; adjust if needed)
if (process.env.NODE_ENV !== "development") {
  serveStatic(app);
}

// Wrap the Express app into a serverless function
export default serverless(app);
