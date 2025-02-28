
// Netlify serverless function for API routes
import express from "express";
import { registerRoutes } from "../../server/routes.js";
import serverless from "serverless-http";

// Create Express app
const app = express();

// Middleware
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

// Wrap in an async handler
const handler = async (event, context) => {
  // Register routes to the app
  await registerRoutes(app);
  
  // Convert to serverless function
  const serverlessHandler = serverless(app);
  return serverlessHandler(event, context);
};

export { handler };
