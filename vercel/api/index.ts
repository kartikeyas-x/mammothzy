
import serverless from 'serverless-http';
import express from 'express';
import { registerRoutes } from '../../server/routes';
import { serveStatic, log } from '../../server/vite';

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
