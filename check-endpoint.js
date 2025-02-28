
import axios from 'axios';

// Get the endpoint from command line arguments
const endpoint = process.argv[2] || '/api/ping';

// Determine the base URL (using VERCEL_URL if available)
const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://mammothzy-git-main-kartikeyas-xs-projects.vercel.app';

async function checkEndpoint() {
  console.log(`🔍 Checking GET ${BASE_URL}${endpoint}`);
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.headers['content-type']?.includes('application/json')) {
      console.log(`📄 Response (JSON): ${JSON.stringify(response.data, null, 2)}`);
    } else {
      console.log(`📄 Response (Text): ${response.data}`);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    
    if (error.response) {
      console.log(`📊 Status: ${error.response.status} ${error.response.statusText}`);
      console.log(`📄 Response: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

checkEndpoint();
