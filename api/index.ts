// File: api/index.ts

import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes"; // from your server folder
import { serveStatic, log } from "../server/vite";   // from your server folder
import { createServer, proxy } from "@vercel/node";

// Create an Express application instance
const app = express();

// Setup JSON and URL-encoded middleware
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

// Register API routes using your existing server/routes.ts
// Note: registerRoutes returns a Promise of an HTTP Server,
// but here we only need it to set up routes on the app.
await registerRoutes(app);

// For production, serve static files (the Vite-built frontend)
// This call uses your existing serveStatic function from server/vite.ts.
if (process.env.NODE_ENV !== "development") {
  serveStatic(app);
}

// Wrap the Express app using Vercel's Node adapter.
const server = createServer(app);

// Export the handler function that Vercel will invoke per request.
export default (req: Request, res: Response) => {
  proxy(server, req, res);
};
