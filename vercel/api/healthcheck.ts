// Using Express-compatible types instead of Next.js
import type { Request, Response } from "express";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    deployment: process.env.VERCEL ? 'vercel' : 'other'
  });
}