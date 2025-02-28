import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    message: 'Database debug endpoint',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    database: {
      type: process.env.DATABASE_TYPE || 'unknown',
      url: process.env.DATABASE_URL ? 'configured' : 'not configured'
    }
  });
}