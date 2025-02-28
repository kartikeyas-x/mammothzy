
import express from 'express';
import serverless from 'serverless-http';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { insertActivitySchema } from '../../shared/schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

// Create database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is not set');
}

const sql = connectionString ? neon(connectionString) : null;
const db = sql ? drizzle(sql) : null;

// Helper function to execute SQL queries safely
async function executeQuery(query, params = []) {
  if (!sql) {
    throw new Error('Database connection not established');
  }
  
  try {
    return await sql`${query}`;
  } catch (error) {
    console.error('SQL query error:', error);
    throw error;
  }
}

// API Routes
app.get('/api/ping', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint
app.get('/api/debug-db', async (req, res) => {
  try {
    if (!connectionString) {
      return res.status(500).json({ error: 'No DATABASE_URL environment variable found' });
    }
    
    const result = await sql`SELECT 1 as connection_test;`;
    
    // Check if activities table exists
    const tableResult = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'activities'
      );
    `;
    
    // List columns in the table
    const columnResult = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'activities';
    `;
    
    return res.status(200).json({
      connection: 'successful',
      connectionTest: result,
      tableExists: tableResult[0]?.exists || false,
      columns: columnResult,
      environment: process.env.NODE_ENV,
      vercel: true
    });
  } catch (error) {
    console.error('Database debug error:', error);
    return res.status(500).json({
      error: 'Database connection error',
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? 'hidden' : error.stack
    });
  }
});

// Activities endpoints
app.post('/api/activities', async (req, res) => {
  try {
    // Validate request body
    console.log('Received activity data:', JSON.stringify(req.body));
    const activity = insertActivitySchema.parse(req.body);
    
    if (!sql) {
      throw new Error('Database connection not established');
    }
    
    // Insert activity into database
    const result = await sql`
      INSERT INTO activities (
        name, 
        category, 
        description, 
        activity_type, 
        location_type,
        min_members, 
        max_members, 
        address_line_1, 
        address_line_2, 
        zip_code, 
        city, 
        state, 
        contact_number, 
        contact_name
      ) VALUES (
        ${activity.name}, 
        ${activity.category}, 
        ${activity.description || ''}, 
        ${activity.activity_type || ''}, 
        ${activity.location_type || ''},
        ${activity.min_members || 1}, 
        ${activity.max_members || 1}, 
        ${activity.address_line_1 || ''}, 
        ${activity.address_line_2 || ''}, 
        ${activity.zip_code || ''}, 
        ${activity.city || ''}, 
        ${activity.state || ''}, 
        ${activity.contact_number || ''}, 
        ${activity.contact_name || ''}
      ) RETURNING *
    `;
    
    const created = result[0];
    res.status(201).json(created);
  } catch (error) {
    console.error('Error in POST /api/activities:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid activity data', details: error.errors });
    }
    
    res.status(500).json({ 
      error: 'Server error while creating activity',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }
});

app.get('/api/activities', async (req, res) => {
  try {
    if (!sql) {
      throw new Error('Database connection not established');
    }
    
    const activities = await sql`SELECT * FROM activities ORDER BY id DESC`;
    res.json(activities);
  } catch (error) {
    console.error('Error in GET /api/activities:', error);
    res.status(500).json({ error: 'Error retrieving activities' });
  }
});

app.get('/api/activities/:id', async (req, res) => {
  try {
    if (!sql) {
      throw new Error('Database connection not established');
    }
    
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const activities = await sql`SELECT * FROM activities WHERE id = ${id}`;
    
    if (!activities.length) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    res.json(activities[0]);
  } catch (error) {
    console.error(`Error in GET /api/activities/${req.params.id}:`, error);
    res.status(500).json({ error: 'Error retrieving activity' });
  }
});

// Health check endpoint
app.get('/api/healthcheck', async (req, res) => {
  try {
    if (!sql) {
      return res.status(500).json({
        status: 'unhealthy',
        error: 'Database connection not established'
      });
    }
    
    await sql`SELECT 1 as connection_test;`;
    
    res.json({
      status: 'healthy',
      database: { status: 'connected' },
      environment: process.env.NODE_ENV || 'development',
      vercel: process.env.VERCEL ? true : false,
      region: process.env.VERCEL_REGION || 'unknown',
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Healthcheck failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? 'hidden' : error.stack,
      timestamp: new Date().toISOString()
    });
  }
});

// Export the serverless function
export default serverless(app);
