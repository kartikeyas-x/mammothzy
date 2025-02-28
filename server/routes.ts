import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertActivitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add better error handling to POST endpoint
  app.post("/api/activities", async (req, res) => {
    try {
      const activity = insertActivitySchema.parse(req.body);
      
      // Log the activity for debugging
      console.log("Attempting to create activity:", JSON.stringify(activity));
      
      // Check if storage module is available
      if (!storage || typeof storage.createActivity !== 'function') {
        throw new Error("Storage module or createActivity function is not properly defined");
      }
      
      const created = await storage.createActivity(activity);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error in POST /api/activities:", error);
      
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid activity data", details: error.errors });
      }
      
      // More detailed error response
      res.status(500).json({ 
        error: "Server error while creating activity",
        message: process.env.NODE_ENV === 'production' ? undefined : error.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
      });
    }
  });

  app.get("/api/activities", async (_req, res) => {
    try {
      const activities = await storage.getAllActivities();
      res.json(activities);
    } catch (error) {
      console.error("Error in GET /api/activities:", error);
      res.status(500).json({ error: "Error retrieving activities" });
    }
  });

  app.get("/api/activities/:id", async (req, res) => {
    try {
      const activity = await storage.getActivity(Number(req.params.id));
      if (!activity) {
        res.status(404).json({ error: "Activity not found" });
        return;
      }
      res.json(activity);
    } catch (error) {
      console.error(`Error in GET /api/activities/${req.params.id}:`, error);
      res.status(500).json({ error: "Error retrieving activity" });
    }
  });

  // Add comprehensive diagnostic route for troubleshooting
  app.get("/api/healthcheck", async (req, res) => {
    try {
      // Use dedicated health check method
      const dbStatus = await storage.healthCheck();
      
      // Return detailed environment info for debugging
      res.json({
        status: dbStatus.status === "healthy" ? "healthy" : "unhealthy",
        database: dbStatus,
        environment: process.env.NODE_ENV || "development",
        vercel: process.env.VERCEL ? true : false,
        region: process.env.VERCEL_REGION || "unknown",
        nodeVersion: process.version,
        timestamp: new Date().toISOString(),
        memoryUsage: process.memoryUsage()
      });
    } catch (error) {
      console.error("Healthcheck failed:", error);
      res.status(500).json({
        status: "unhealthy",
        error: error.message,
        stack: process.env.NODE_ENV === "production" ? "hidden" : error.stack,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  // Add a simple echo route to test basic functionality
  app.get("/api/echo", (req, res) => {
    res.json({
      message: "Echo endpoint working",
      query: req.query,
      timestamp: new Date().toISOString()
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
