
import serverless from 'serverless-http';
import app from '../../api/index';

// Add middleware to handle Vercel environment specifics
app.use((req, res, next) => {
  // Log requests in Vercel environment
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Add error handling specific to serverless environment
app.use((err, req, res, next) => {
  console.error('Serverless error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message 
  });
});

// Export a serverless function handler for Vercel
const handler = serverless(app);
export default async (req, res) => {
  try {
    return await handler(req, res);
  } catch (error) {
    console.error('Unhandled error in serverless handler:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
