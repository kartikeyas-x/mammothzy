
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from "@neondatabase/serverless";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
      debug.database['connection'] = 'successful';
      debug.database['test'] = result;
      
      // Check if tables exist
      try {
        const tables = await sql`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
        `;
        debug.database['tables'] = tables.map(t => t.table_name);
      } catch (tableError) {
        debug.database['tables_error'] = tableError.message;
      }
    } else {
      debug.database['connection'] = 'no_url_provided';
    }
  } catch (error) {
    debug.database['connection'] = 'failed';
    debug.database['error'] = error.message;
  }

  res.status(200).json(debug);
}
