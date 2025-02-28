
import type { Request, Response } from "express";

export default function handler(req: Request, res: Response) {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    deployment: process.env.VERCEL ? 'vercel' : 'other'
  });
}
