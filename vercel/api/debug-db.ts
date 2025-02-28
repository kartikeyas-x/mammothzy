
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  const debug = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    database: {
      url: process.env.DATABASE_URL ? 'configured' : 'missing'
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers
    },
    vercel: {
      region: process.env.VERCEL_REGION || 'unknown',
      env: process.env.VERCEL ? 'vercel' : 'not-vercel',
      url: process.env.VERCEL_URL || 'unknown'
    },
    runtime: {
      version: process.version,
      platform: process.platform
    }
  };

  // Add database check
  try {
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      const result = await sql`SELECT 1 as connection_test`;
      debug.database.connection = 'successful';
      debug.database.test = result;
    } else {
      debug.database.connection = 'no_url_provided';
    }
  } catch (error) {
    debug.database.connection = 'failed';
    debug.database.error = error.message;
  }

  res.status(200).json(debug);
}
