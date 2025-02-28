
// API Test Script
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// Configuration 
const API_BASE_URL = process.env.VERCEL_URL || 'https://mammothzy-git-main-kartikeyas-xs-projects.vercel.app';

async function testAPI() {
  console.log(`🔍 Testing API at ${API_BASE_URL}`);

  // Test data
  const testActivity = {
    name: "Test Activity",
    category: "Test Category",
    description: "This is a test activity created by the API test script",
    activity_type: "Indoor",
    location_type: "Physical",
    min_members: 1,
    max_members: 10,
    address_line_1: "123 Test St",
    city: "Test City",
    state: "Test State",
    zip_code: "12345",
    contact_name: "Test Contact",
    contact_number: "123-456-7890"
  };

  try {
    // Test ping endpoint first (simple endpoint)
    console.log(`🔍 Checking GET ${API_BASE_URL}/api/ping`);
    try {
      const pingResponse = await fetch(`${API_BASE_URL}/api/ping`);
      console.log(`📊 Status: ${pingResponse.status} ${pingResponse.statusText}`);
      if (pingResponse.ok) {
        const pingData = await pingResponse.json();
        console.log(`📄 Response:`, JSON.stringify(pingData, null, 2));
      } else {
        const text = await pingResponse.text();
        console.log(`📄 Response:`, text);
      }
    } catch (pingError) {
      console.error(`❌ Ping request failed:`, pingError.message);
    }

    // Test debug-db endpoint
    console.log(`\n🔍 Checking GET ${API_BASE_URL}/api/debug-db`);
    try {
      const debugResponse = await fetch(`${API_BASE_URL}/api/debug-db`);
      console.log(`📊 Status: ${debugResponse.status} ${debugResponse.statusText}`);
      
      if (debugResponse.ok) {
        const debugData = await debugResponse.json();
        console.log(`📄 Response:`, JSON.stringify(debugData, null, 2));
      } else {
        const text = await debugResponse.text();
        console.log(`📄 Response:`, text);
      }
    } catch (debugError) {
      console.error(`❌ Debug-db request failed:`, debugError.message);
    }

    // Only continue with advanced tests if basic endpoints work
    console.log(`\n🔍 Testing POST ${API_BASE_URL}/api/activities`);
    try {
      const createResponse = await fetch(`${API_BASE_URL}/api/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testActivity),
      });

      console.log(`📊 Status: ${createResponse.status} ${createResponse.statusText}`);
      
      if (createResponse.ok) {
        const createData = await createResponse.json();
        console.log(`📄 Response:`, JSON.stringify(createData, null, 2));
      } else {
        const text = await createResponse.text();
        console.log(`📄 Response:`, text);
      }
    } catch (createError) {
      console.error(`❌ Create activity request failed:`, createError.message);
    }

  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

// Run the tests
testAPI();
