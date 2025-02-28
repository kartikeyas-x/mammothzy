
import { NextApiRequest, NextApiResponse } from "next";

// Simple debugging endpoint that doesn't depend on database connections
// This is useful for isolating issues
export default async function debug(req: NextApiRequest, res: NextApiResponse) {
  try {
    const info = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercel: Boolean(process.env.VERCEL),
      vercelRegion: process.env.VERCEL_REGION || "unknown",
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query,
      // List environment variables (excluding secrets)
      env: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_REGION: process.env.VERCEL_REGION,
        // Don't include DATABASE_URL or other secrets
      },
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
    };

    return res.status(200).json(info);
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return res.status(500).json({
      error: "Debug endpoint error",
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? "hidden" : error.stack,
    });
  }
}
