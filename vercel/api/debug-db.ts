
import type { Request, Response } from "express";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: Request, res: Response) {
  try {
    // Basic environment info
    const info = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        url: process.env.DATABASE_URL ? 'configured' : 'missing',
        connection: 'pending'
      }
    };
    
    // Test database connection
    if (process.env.DATABASE_URL) {
      try {
        const sql = neon(process.env.DATABASE_URL);
        const result = await sql`SELECT 1 as connection_test`;
        info.database.connection = 'successful';
      } catch (dbError) {
        info.database.connection = 'failed';
        info.database.error = String(dbError);
      }
    }
    
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ 
      error: 'Internal server error',
      message: String(error)
    });
  }
}
