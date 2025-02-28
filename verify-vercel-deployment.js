
import fetch from 'node-fetch';

const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://mammothzy-git-main-kartikeyas-xs-projects.vercel.app';

async function verifyEndpoint(endpoint) {
  console.log(`🔍 Testing ${endpoint}...`);
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const status = response.status;
    let data;
    
    try {
      data = await response.json();
    } catch {
      data = await response.text();
    }
    
    console.log(`✅ ${endpoint}: ${status} ${response.statusText}`);
    console.log(data);
    return true;
  } catch (error) {
    console.error(`❌ ${endpoint}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log(`🚀 Verifying Vercel deployment at ${BASE_URL}\n`);
  
  const endpoints = [
    '/api/healthcheck',
    '/api/ping',
    '/api/debug-db'
  ];
  
  let success = true;
  
  for (const endpoint of endpoints) {
    const result = await verifyEndpoint(endpoint);
    success = success && result;
    console.log(); // Add spacing between results
  }
  
  if (success) {
    console.log('✅ All endpoints are working!');
  } else {
    console.log('❌ Some endpoints failed. Check the logs above.');
  }
}

main().catch(console.error);
