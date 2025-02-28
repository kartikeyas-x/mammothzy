
import { Request, Response } from "express";
import os from "os";

export default function detailedDebugHandler(req: Request, res: Response) {
  // Collect detailed debug information
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: Boolean(process.env.VERCEL),
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
    cpus: os.cpus().length,
    uptime: process.uptime(),
    freemem: os.freemem(),
    totalmem: os.totalmem()
  };

  res.status(200).json(debugInfo);
}
