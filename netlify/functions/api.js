
import express from "express";
import serverless from "serverless-http";
import { registerRoutes } from "../../server/routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  next();
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`Netlify Function: ${req.method} ${req.path}`);
  next();
});

// Initialize routes and setup handler
let handler;

// This pattern avoids top-level await which causes issues with the ESM format
export const setupHandler = async () => {
  if (!handler) {
    await registerRoutes(app);
    handler = serverless(app);
  }
  return handler;
};

export const handler = async (event, context) => {
  // For preflight OPTIONS requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
      body: "",
    };
  }

  // Setup handler (first request will initialize)
  const serverlessHandler = await setupHandler();
  
  // Process the request
  try {
    return await serverlessHandler(event, context);
  } catch (error) {
    console.error("Error in Netlify function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
