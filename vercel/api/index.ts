
import express from "express";
import { registerRoutes } from "../../server/routes";
import { serveStatic } from "../../server/vite";
import serverless from "serverless-http";

// Create an instance of the Express app
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
      console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Register your API routes and export the serverless handler
const handler = serverless(app);

// Initialize routes
registerRoutes(app).catch(err => {
  console.error("Failed to register routes:", err);
});

export const config = {
  api: {
    bodyParser: false,
  }
};

// Export the serverless handler
export default handler;
