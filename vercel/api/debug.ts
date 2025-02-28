import { Request, Response } from "express";
import { db } from "../../db";
import os from "os";

export default async function debugHandler(req: Request, res: Response) {
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
    },
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
    cpus: os.cpus().length,
    uptime: process.uptime(),
    freemem: os.freemem(),
    totalmem: os.totalmem(),
    databaseInfo: null as any
  };

  // Try to check database connectivity
  try {
    const dbResult = await db.query.sql`SELECT NOW()`;
    debugInfo.databaseInfo = {
      connected: true,
      result: dbResult
    };
  } catch (dbError) {
    debugInfo.databaseInfo = {
      connected: false,
      error: String(dbError)
    };
  }

  // Try to load package.json
  try {
    const pkg = await import("../../package.json", { assert: { type: "json" } });
    debugInfo.dependencies = pkg.default.dependencies;
  } catch (error) {
    debugInfo.packageJsonError = String(error);
  }

  res.status(200).json(debugInfo);
}