
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from "@neondatabase/serverless";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Basic system check
    const systemInfo = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      vercel: process.env.VERCEL ? true : false,
      region: process.env.VERCEL_REGION || 'unknown',
      nodeVersion: process.version
    };
    
    // Check database connection if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      try {
        const sql = neon(process.env.DATABASE_URL);
        const result = await sql`SELECT 1 as connection_test`;
        
        // Also check if activities table exists
        const tableCheck = await sql`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'activities'
          )
        `;
        
        const tableExists = tableCheck[0]?.exists === true;
        
        systemInfo['database'] = {
          connection: "successful",
          schema: tableExists ? "complete" : "missing",
          tables: {
            activities: tableExists
          }
        };
      } catch (dbError) {
        systemInfo['database'] = {
          connection: "failed",
          error: dbError.message
        };
      }
    } else {
      systemInfo['database'] = {
        connection: "no_url_provided"
      };
    }
    
    return res.status(200).json(systemInfo);
  } catch (error) {
    return res.status(500).json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
