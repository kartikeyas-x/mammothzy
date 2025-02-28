
// A simple script to verify database connection
import { storage } from './server/storage.js';

async function main() {
  try {
    console.log('Testing database connection...');
    const result = await storage.healthCheck();
    console.log('Database status:', result);
    
    if (result.status === 'healthy') {
      console.log('✅ Database connection successful!');
    } else {
      console.error('❌ Database connection failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error testing database:', error);
  }
}

main();
