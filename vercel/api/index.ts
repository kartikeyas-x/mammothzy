
import express from "express";
import serverless from "serverless-http";
import { registerRoutes } from "../../server/routes";

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Register API routes
try {
  registerRoutes(app);
} catch (error) {
  console.error("Error registering routes:", error);
  app.use('/api', (req, res) => {
    res.status(500).json({ error: "Server configuration error" });
  });
}

// Export serverless handler
export default serverless(app);

// Export Vercel config
export const config = {
  api: {
    bodyParser: false
  }
};
