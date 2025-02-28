import { NextApiRequest, NextApiResponse } from "next";
import { insertActivitySchema } from "./schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Handle GET request
    if (req.method === 'GET') {
      return res.status(200).json({
        message: 'API is running',
        endpoint: '/api',
        method: 'GET',
        timestamp: new Date().toISOString()
      });
    }

    // Handle POST request (for activity creation)
    if (req.method === 'POST') {
      // Validate request body
      const result = insertActivitySchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: result.error.format() 
        });
      }

      // For now, just return success response without DB interaction
      return res.status(200).json({
        message: 'Activity validation successful',
        data: result.data,
        timestamp: new Date().toISOString()
      });
    }

    // Handle other methods
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}