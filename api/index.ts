// File: api/index.ts

import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes"; // from your server folder
import { serveStatic, log } from "../server/vite";   // from your server folder
import serverless from "serverless-http";

// Create an instance of your Express app
const app = express();

// Setup middleware for JSON parsing and URL encoding
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Example middleware for logging requests
app.use((req, res, next) => {
  const start = Date.now();
  const originalJson = res.json.bind(res);
  res.json = function (body, ...args) {
    return originalJson(body, ...args);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Register API routes (this is your existing API setup)
await registerRoutes(app);

// Serve static files in production (your Vite-built frontend)
if (process.env.NODE_ENV !== "development") {
  serveStatic(app);
}

// Wrap the Express app using serverless-http
export default serverless(app);
