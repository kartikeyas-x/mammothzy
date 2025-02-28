
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
import { NextApiRequest, NextApiResponse } from 'next';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { activities } from '../../shared/schema';

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
    query: req.query
  };

  try {
    // Test database connection
    const connectionString = process.env.DATABASE_URL || '';
    if (!connectionString) {
      debug.database.connection = 'failed - no connection string';
    } else {
      try {
        const sql = neon(connectionString);
        const db = drizzle(sql);
        
        // Test basic connection
        const result = await sql`SELECT 1 as test`;
        debug.database.connection = 'successful';
        
        // Check activities table
        try {
          const tableCheck = await sql`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = 'activities'
            );
          `;
          
          const tableExists = tableCheck[0]?.exists === true;
          debug.schema.activities = tableExists ? 'exists' : 'missing';
          
          if (tableExists) {
            // Count records
            const countResult = await sql`SELECT COUNT(*) FROM activities`;
            debug.schema.activities = `exists (${countResult[0]?.count || 0} records)`;
            
            // Get columns
            const columnResult = await sql`
              SELECT column_name, data_type 
              FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = 'activities';
            `;
            
            debug.schema.columns = columnResult.map(col => ({
              name: col.column_name,
              type: col.data_type
            }));
          }
        } catch (schemaError) {
          debug.schema.activities = `error: ${schemaError.message}`;
        }
      } catch (dbError) {
        debug.database.connection = `failed - ${dbError.message}`;
      }
    }
    
    // Return debug info
    res.status(200).json(debug);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      debug
    });
  }
}
