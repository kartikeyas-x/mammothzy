
import express, { Request, Response } from "express";
import serverless from "serverless-http";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create an instance of your Express app
const app = express();

// Middleware: parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Add a simple root API route
app.get("/api", (req: Request, res: Response) => {
  res.json({
    message: "API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Add activities route
app.post("/api/activities", async (req: Request, res: Response) => {
  try {
    // Just echo back the request for now
    res.status(201).json({
      message: "Activity creation endpoint (simplified for testing)",
      receivedData: req.body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Simple error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Export the handler for Vercel
export default serverless(app);
