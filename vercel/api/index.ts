
import express from "express";
import { registerRoutes } from "../../server/routes";
import { serveStatic, log } from "../../server/vite";
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
const handler = async () => {
  await registerRoutes(app);
  return serverless(app);
};

export const config = {
  api: {
    bodyParser: false,
  }
};

export default handler();
