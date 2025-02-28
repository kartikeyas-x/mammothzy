
// Utility to check if a specific endpoint is working
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

async function checkEndpoint() {
  // Get the endpoint from command line args or use default
  const args = process.argv.slice(2);
  const endpoint = args[0] || '/api/ping';
  
  // Get base URL from env or use default
  const API_BASE_URL = process.env.VERCEL_URL || 'https://mammothzy-git-main-kartikeyas-xs-projects.vercel.app';
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  
  console.log(`🔍 Checking GET ${fullUrl}`);
  
  try {
    const response = await fetch(fullUrl);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    try {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        console.log(`📄 Response (JSON):`, JSON.stringify(data, null, 2).substring(0, 500) + 
          (JSON.stringify(data, null, 2).length > 500 ? '...' : ''));
      } else {
        const text = await response.text();
        console.log(`📄 Response (Text):`, text.substring(0, 500) + (text.length > 500 ? '...' : ''));
      }
    } catch (parseError) {
      console.error(`❌ Response parsing error:`, parseError.message);
      // Can't read body again if it's already been read
      console.log(`📄 Raw Response: [Body already consumed]`);
    }
  } catch (error) {
    console.error(`❌ Request failed:`, error.message);
  }
}

checkEndpoint();
