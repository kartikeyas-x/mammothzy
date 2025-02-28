
import { Request, Response } from "express";

export default function debugDbHandler(req: Request, res: Response) {
  // Debug database info
  const dbInfo = {
    timestamp: new Date().toISOString(),
    databaseUrl: process.env.DATABASE_URL ? '[REDACTED]' : 'not defined',
    vercel: Boolean(process.env.VERCEL),
    environment: process.env.NODE_ENV || 'development'
  };

  res.status(200).json(dbInfo);
}
