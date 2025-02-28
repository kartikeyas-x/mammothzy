// Using Express-compatible types instead of Next.js
import type { Request, Response } from "express";
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
// Using Express-compatible types instead of Next.js
import type { Request, Response } from "express";
import { insertActivitySchema, activitySchema } from "./schema";

export default async function handler(req: Request, res: Response) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request (for CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      message: "Activities API endpoint",
      endpoints: ["/api/activities"],
      documentation: "Use POST to create a new activity"
    });
  }

  if (req.method === 'POST') {
    try {
      const data = req.body;
      
      // Validate the input data
      const validatedData = insertActivitySchema.parse(data);
      
      // For this example, we'll just return the validated data
      // In a real app, you'd save to database here
      return res.status(201).json({
        message: "Activity created (mock)",
        activity: validatedData
      });
    } catch (error) {
      console.error('Validation error:', error);
      return res.status(400).json({ 
        error: "Invalid activity data",
        details: error
      });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
}
