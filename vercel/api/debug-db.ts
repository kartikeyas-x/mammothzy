
import { Request, Response } from "express";

export default function debugDbHandler(req: Request, res: Response) {
  // Simple response to verify the endpoint is working
  res.status(200).json({
    message: "Debug DB endpoint",
    timestamp: new Date().toISOString(),
    vercel: Boolean(process.env.VERCEL),
    env: process.env.NODE_ENV || 'development'
  });
}
