
// Test script specifically for Vercel serverless functions
import fetch from 'node-fetch';

const API_BASE_URL = 'https://mammothzy-git-main-kartikeyas-xs-projects.vercel.app';

// List of endpoints to test
const endpoints = [
  '/api/ping',
  '/api/debug-db',
  '/api/healthcheck'
];

async function testVercelEndpoints() {
  console.log(`🔍 Testing Vercel API endpoints at ${API_BASE_URL}\n`);
  
  for (const endpoint of endpoints) {
    console.log(`Testing endpoint: ${endpoint}`);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      try {
        // Clone the response before reading it
        const responseClone = response.clone();
        
        // Try to parse as JSON first
        const data = await responseClone.json();
        console.log(`Response: ${JSON.stringify(data, null, 2).substring(0, 300)}...\n`);
      } catch (parseError) {
        // If not JSON, get as text
        try {
          const text = await response.text();
          console.log(`Response (text): ${text.substring(0, 300)}...\n`);
        } catch (textError) {
          console.log(`Error reading response body: ${textError.message}\n`);
        }
      }
      
      // Add delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error testing ${endpoint}: ${error.message}\n`);
    }
  }
}

// Execute the function
testVercelEndpoints();
