
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const debug = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    database: {
      url: process.env.DATABASE_URL ? 'configured' : 'missing',
      connection: 'pending'
    },
    schema: {
      activities: 'pending'
    },
    headers: req.headers,
    query: req.query,
    modules: {},
    vercel: {
      region: process.env.VERCEL_REGION || 'unknown',
      env: process.env.VERCEL ? 'vercel' : 'not-vercel',
      url: process.env.VERCEL_URL || 'unknown'
    }
  };

  // Test database connection
  try {
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
      const sql = neon(connectionString);
      await sql`SELECT 1`;
      debug.database.connection = 'successful';

      // Check if activities table exists
      const tableResult = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'activities'
        );
      `;

      debug.schema.activities = tableResult[0]?.exists ? 'exists' : 'missing';
      
      // Try to count records
      try {
        const countResult = await sql`SELECT count(*) FROM activities`;
        debug.schema.count = countResult[0]?.count || 0;
      } catch (countError) {
        debug.schema.count = `error: ${countError.message}`;
      }
    } else {
      debug.database.connection = 'failed - no connection string';
    }
  } catch (error) {
    debug.database.connection = `failed - ${error.message}`;
  }

  // Try to check for imported modules
  try {
    debug.modules['drizzle-orm'] = typeof drizzle === 'function' ? 'available' : 'missing';
    debug.modules['@neondatabase/serverless'] = typeof neon === 'function' ? 'available' : 'missing';
  } catch (error) {
    debug.modules['error'] = error.message;
  }

  res.status(200).json(debug);
}
