
import serverless from 'serverless-http';
import express from 'express';
import { registerRoutes } from '../../server/routes';
import { serveStatic, log } from '../../server/vite';
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Function to ensure database tables exist
async function ensureTables() {
  console.log('Checking and creating database tables if needed...');
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('DATABASE_URL not set!');
    return false;
  }
  
  try {
    console.log('Connecting to database...');
    const sql = neon(connectionString);
    
    // Check if activities table exists
    const tableResult = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'activities'
      );
    `;
    
    const tableExists = tableResult[0].exists;
    console.log(`Activities table exists: ${tableExists ? 'YES' : 'NO'}`);
    
    // Create table if it doesn't exist
    if (!tableExists) {
      console.log('Creating activities table...');
      await sql`
        CREATE TABLE IF NOT EXISTS activities (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          description TEXT NOT NULL,
          activity_type TEXT NOT NULL,
          location_type TEXT NOT NULL,
          min_members INTEGER,
          max_members INTEGER,
          address_line_1 TEXT NOT NULL,
          address_line_2 TEXT,
          zip_code TEXT NOT NULL,
          city TEXT NOT NULL,
          state TEXT NOT NULL,
          contact_number TEXT NOT NULL,
          contact_name TEXT NOT NULL
        )
      `;
      console.log('✅ Table created successfully!');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    return false;
  }
}

// Create an Express app instance specifically for serverless
const app = express();

// Add basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} in ${duration}ms`);
  });
  
  next();
});

// Special middleware for Vercel
app.use((req, res, next) => {
  // Make sure we have path info
  req.path = req.path || req.url.split('?')[0];
  next();
});

// Initialize async handler 
const initServer = async () => {
  try {
    // Ensure database tables exist
    await ensureTables();
    
    // Set up routes
    await registerRoutes(app);
    
    // Add error handler
    app.use((err, req, res, next) => {
      console.error('Serverless error:', err);
      res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
      });
    });
    
    // In production, serve static files
    if (process.env.NODE_ENV !== 'development') {
      serveStatic(app);
    }
    
    // Add a catch-all route for debugging
    app.use('*', (req, res) => {
      res.status(404).json({ error: 'Not Found', path: req.originalUrl });
    });
    
    return serverless(app);
  } catch (error) {
    console.error('Failed to initialize server:', error);
    const errorHandler = (req, res) => {
      res.status(500).json({ 
        error: 'Server initialization failed',
        message: process.env.NODE_ENV === 'production' ? 'Service temporarily unavailable' : error.message 
      });
    };
    
    // Create a minimal error-reporting app
    const errorApp = express();
    errorApp.use('*', errorHandler);
    return serverless(errorApp);
  }
};

// Initialize server and handle requests
let handler;

export default async (req, res) => {
  try {
    if (!handler) {
      console.log('Initializing serverless handler...');
      handler = await initServer();
    }
    return await handler(req, res);
  } catch (error) {
    console.error('Unhandled serverless error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'The server encountered an unexpected condition'
    });
  }
};
