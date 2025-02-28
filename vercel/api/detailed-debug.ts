
import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  // Prevent the response from being consumed multiple times
  res.setHeader('Cache-Control', 'no-store');
  
  const debug = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    database: {
      url: process.env.DATABASE_URL ? 'configured' : 'missing',
      connection: 'pending'
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
    nodejs: {
      version: process.version,
      memory: process.memoryUsage()
    }
  };

  // Test database connection
  try {
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
      const sql = neon(connectionString);
      const result = await sql`SELECT 1 as connection_test`;
      debug.database.connection = 'successful';
      debug.database.test_result = result;

      // Check if activities table exists
      try {
        const tableResult = await sql`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'activities'
          );
        `;
        debug.database.activities_table_exists = tableResult[0]?.exists || false;
      } catch (tableError) {
        debug.database.activities_table_error = tableError.message;
      }
    } else {
      debug.database.connection = 'no connection string provided';
    }
  } catch (dbError) {
    debug.database.connection = 'failed';
    debug.database.error = dbError.message;
  }

  return res.status(200).json(debug);
}
