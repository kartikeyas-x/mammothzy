import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertActivitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add better error handling to POST endpoint
  app.post("/api/activities", async (req, res) => {
    try {
      const activity = insertActivitySchema.parse(req.body);
      const created = await storage.createActivity(activity);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error in POST /api/activities:", error);
      
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid activity data", details: error.errors });
      }
      
      res.status(500).json({ 
        error: "Server error while creating activity",
        message: process.env.NODE_ENV === 'production' ? undefined : error.message
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

  // Add diagnostic route for troubleshooting
  app.get("/api/healthcheck", async (req, res) => {
    try {
      // Check if we can connect to the database
      await storage.getAllActivities();
      
      // Return environment info to help with debugging
      res.json({
        status: "healthy",
        environment: process.env.NODE_ENV || "development",
        vercel: process.env.VERCEL ? true : false,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Healthcheck failed:", error);
      res.status(500).json({
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
