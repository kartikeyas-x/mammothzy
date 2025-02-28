
import { Request, Response } from "express";
import { db } from "../../db";

export default async function detailedDebugHandler(req: Request, res: Response) {
  // Create an object to hold all debug information
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    vercel: {
      isVercel: Boolean(process.env.VERCEL),
      region: process.env.VERCEL_REGION,
      env: process.env.VERCEL_ENV,
      url: process.env.VERCEL_URL,
    },
    request: {
      method: req.method,
      url: req.url,
      query: req.query,
      headers: req.headers,
    },
    database: {
      url: process.env.DATABASE_URL ? '[REDACTED]' : 'not defined',
      connection: 'unknown',
      testResult: null as any,
      activitiesTable: {
        exists: false,
        error: null as any
      }
    }
  };

  // Test database connection
  try {
    const result = await db.query.sql`SELECT NOW()`;
    debugInfo.database.connection = 'connected';
    debugInfo.database.testResult = result;
    
    // Check if activities table exists
    try {
      const tableCheck = await db.query.sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name = 'activities'
        );
      `;
      debugInfo.database.activitiesTable.exists = tableCheck[0]?.exists || false;
    } catch (tableError) {
      debugInfo.database.activitiesTable.error = String(tableError);
    }
  } catch (dbError) {
    debugInfo.database.connection = 'failed';
    debugInfo.database.testResult = String(dbError);
  }

  res.status(200).json(debugInfo);
}
