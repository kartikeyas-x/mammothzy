
// Utility to check if a specific endpoint is working
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

async function checkEndpoint() {
  // Get the endpoint from command line args or use default
  const args = process.argv.slice(2);
  const endpoint = args[0] || '/api/healthcheck';
  
  // Get base URL from env or use default
  const API_BASE_URL = process.env.VERCEL_URL || 'https://mammothzy-git-main-kartikeyas-xs-projects.vercel.app';
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  
  console.log(`🔍 Checking GET ${fullUrl}`);
  
  try {
    const response = await fetch(fullUrl);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    // Try to parse as JSON first
    try {
      const data = await response.json();
      console.log(`📄 Response:`, JSON.stringify(data, null, 2));
    } catch (e) {
      // If not JSON, get as text
      const text = await response.text();
      console.log(`📄 Response:`, text);
    }
  } catch (error) {
    console.error(`❌ Request failed:`, error.message);
  }
}

checkEndpoint();
