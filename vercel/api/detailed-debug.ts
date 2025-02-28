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
    modules: {}
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
    } else {
      debug.database.connection = 'failed - no connection string';
    }
  } catch (error) {
    debug.database.connection = `failed - ${error.message}`;
  }

  // Try to check for imported modules
  try {
    debug.modules['drizzle-orm'] = !!drizzle;
    debug.modules['@neondatabase/serverless'] = !!neon;
  } catch (error) {
    debug.modules['error'] = error.message;
  }

  res.status(200).json(debug);
}