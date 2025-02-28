
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
        // Try to parse as JSON first
        const data = await response.json();
        console.log(`Response: ${JSON.stringify(data, null, 2).substring(0, 300)}...\n`);
      } catch (parseError) {
        // If not JSON, get as text
        const text = await response.text();
        console.log(`Response (text): ${text.substring(0, 300)}...\n`);
      }
    } catch (error) {
      console.error(`Error testing ${endpoint}: ${error.message}\n`);
    }
  }
}

testVercelEndpoints();
