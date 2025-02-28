
// Simple script to verify endpoints are working
import fetch from 'node-fetch';

const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://mammothzy-git-main-kartikeyas-xs-projects.vercel.app';

async function testEndpoint(path) {
  try {
    console.log(`Testing ${BASE_URL}${path}...`);
    const response = await fetch(`${BASE_URL}${path}`);
    const status = response.status;
    
    let data;
    try {
      data = await response.json();
    } catch {
      data = await response.text();
    }
    
    console.log(`Status: ${status}`);
    console.log(data);
    return true;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return false;
  }
}

// Test the main endpoints
async function main() {
  console.log(`Checking endpoints at ${BASE_URL}`);
  await testEndpoint('/api/healthcheck');
  await testEndpoint('/api/debug-db');
  await testEndpoint('/');
}

main().catch(console.error);
