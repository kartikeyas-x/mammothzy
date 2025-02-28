
import express from "express";
import serverless from "serverless-http";

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Basic routes for testing
app.get('/api', (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is working",
    timestamp: new Date().toISOString()
  });
});

// Export serverless handler
export default serverless(app);

// Export Vercel config
export const config = {
  api: {
    bodyParser: false
  }
};
