import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertActivitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/activities", async (req, res) => {
    try {
      const activity = insertActivitySchema.parse(req.body);
      const created = await storage.createActivity(activity);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ error: "Invalid activity data" });
    }
  });

  app.get("/api/activities", async (_req, res) => {
    const activities = await storage.getAllActivities();
    res.json(activities);
  });

  app.get("/api/activities/:id", async (req, res) => {
    const activity = await storage.getActivity(Number(req.params.id));
    if (!activity) {
      res.status(404).json({ error: "Activity not found" });
      return;
    }
    res.json(activity);
  });

  const httpServer = createServer(app);
  return httpServer;
}
