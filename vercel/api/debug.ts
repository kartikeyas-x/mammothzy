
import { Request, Response } from "express";

export default function debugHandler(req: Request, res: Response) {
  // Collect debug information
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: Boolean(process.env.VERCEL),
    vercelRegion: process.env.VERCEL_REGION,
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_REGION: process.env.VERCEL_REGION,
      DATABASE_URL_EXISTS: Boolean(process.env.DATABASE_URL)
    }
  };

  res.status(200).json(debugInfo);
}
