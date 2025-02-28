
import serverless from 'serverless-http';
import app from '../../api/index';

// Export a serverless function handler for Vercel
export default serverless(app);
