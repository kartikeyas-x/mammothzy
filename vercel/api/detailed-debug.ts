
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  const debugging = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: Boolean(process.env.VERCEL),
    vercelRegion: process.env.VERCEL_REGION,
    method: req.method,
    url: req.url,
    headers: req.headers,
    requestBody: req.body || null,
    node: {
      version: process.version,
      platform: process.platform,
      arch: process.arch,
      memoryUsage: process.memoryUsage(),
    },
    env: {
      databaseUrlExists: Boolean(process.env.DATABASE_URL),
      nodeEnv: process.env.NODE_ENV,
      // Add any other relevant environment variables (without their values)
    }
  };
  
  // Database checks
  if (process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL);
      
      // Test database connection
      const connectionTest = await sql`SELECT 1 as connection_test;`;
      
      // Check database tables
      const tablesResult = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema='public';
      `;
      
      const tables = tablesResult.map(row => row.table_name);
      
      // Check activities table structure if it exists
      let columns = [];
      if (tables.includes('activities')) {
        const columnsResult = await sql`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_schema='public' AND table_name='activities';
        `;
        columns = columnsResult.map(col => ({
          name: col.column_name,
          type: col.data_type
        }));
      }
      
      debugging.database = {
        connected: true,
        connectionTest,
        tables,
        activitiesColumns: columns
      };
    } catch (dbError) {
      debugging.database = {
        connected: false,
        error: dbError.message,
        stack: process.env.NODE_ENV === 'production' ? null : dbError.stack
      };
    }
  } else {
    debugging.database = { connected: false, reason: 'No DATABASE_URL provided' };
  }
  
  return res.status(200).json(debugging);
}
