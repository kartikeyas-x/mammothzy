// Using Express-compatible types instead of Next.js
import type { Request, Response } from "express";

export default function handler(req: Request, res: Response) {
  res.status(200).json({
    message: 'API is up and running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
}