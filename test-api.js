
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

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
    console.log(`\n🔍 Checking GET ${API_BASE_URL}/api/ping`);
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
    
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test healthcheck endpoint
    console.log(`\n🔍 Checking GET ${API_BASE_URL}/api/healthcheck`);
    try {
      const healthResponse = await fetch(`${API_BASE_URL}/api/healthcheck`);
      console.log(`📊 Status: ${healthResponse.status} ${healthResponse.statusText}`);
      try {
        const healthData = await healthResponse.json();
        console.log(`📄 Response:`, JSON.stringify(healthData, null, 2));
      } catch (parseError) {
        const text = await healthResponse.text();
        console.log(`📄 Response (Text):`, text);
      }
    } catch (healthError) {
      console.error(`❌ Healthcheck request failed:`, healthError.message);
    }
    
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test creating an activity
    console.log(`\n🔍 Testing POST ${API_BASE_URL}/api/activities`);
    try {
      const createResponse = await fetch(`${API_BASE_URL}/api/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testActivity)
      });
      
      console.log(`📊 Status: ${createResponse.status} ${createResponse.statusText}`);
      try {
        const createData = await createResponse.json();
        console.log(`📄 Response:`, JSON.stringify(createData, null, 2));
      } catch (parseError) {
        const text = await createResponse.text();
        console.log(`📄 Response (Text):`, text);
      }
    } catch (createError) {
      console.error(`❌ Create activity request failed:`, createError.message);
    }
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

testAPI();
