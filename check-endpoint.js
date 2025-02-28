
// Simple script to check a specific endpoint
import fetch from 'node-fetch';

// Get endpoint from command line args
const endpoint = process.argv[2] || '/api/healthcheck';
const method = process.argv[3]?.toUpperCase() || 'GET';
const data = process.argv[4] ? JSON.parse(process.argv[4]) : null;

const API_BASE_URL = process.env.VERCEL_URL || 'https://mammothzy-git-main-kartikeyas-xs-projects.vercel.app';
const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

async function checkEndpoint() {
  console.log(`🔍 Checking ${method} ${fullUrl}`);
  
  try {
    const options = {
      method,
      headers: data ? { 'Content-Type': 'application/json' } : {}
    };
    
    if (data) {
      options.body = JSON.stringify(data);
      console.log('With data:', data);
    }
    
    const response = await fetch(fullUrl, options);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const json = await response.json();
      console.log('📄 Response:', JSON.stringify(json, null, 2));
    } else {
      const text = await response.text();
      console.log('📄 Response:', text);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkEndpoint();
