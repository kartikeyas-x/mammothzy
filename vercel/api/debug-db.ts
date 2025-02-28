
import { Request, Response } from "express";
import { db } from "../../db";

// Simple debug endpoint to check database connectivity
export default async function debugDbHandler(req: Request, res: Response) {
  try {
    // Try a simple query
    const result = await db.query.sql`SELECT NOW()`;
    
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        result: result
      }
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: String(error)
      }
    });
  }
}
