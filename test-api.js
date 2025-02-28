
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
    // Test healthcheck endpoint
    console.log(`🔍 Checking GET ${API_BASE_URL}/api/healthcheck`);
    const healthResponse = await fetch(`${API_BASE_URL}/api/healthcheck`);
    console.log(`📊 Status: ${healthResponse.status} ${healthResponse.statusText}`);

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log(`📄 Response:`, JSON.stringify(healthData, null, 2));
    } else {
      const text = await healthResponse.text();
      console.log(`📄 Response:`, text);
    }

    // Test activities POST endpoint
    console.log(`\n🔍 Testing POST ${API_BASE_URL}/api/activities`);
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

      // Test GET single activity if creation was successful
      if (createData.id) {
        console.log(`\n🔍 Testing GET ${API_BASE_URL}/api/activities/${createData.id}`);
        const getResponse = await fetch(`${API_BASE_URL}/api/activities/${createData.id}`);
        console.log(`📊 Status: ${getResponse.status} ${getResponse.statusText}`);

        if (getResponse.ok) {
          const getData = await getResponse.json();
          console.log(`📄 Response:`, JSON.stringify(getData, null, 2));
        } else {
          const text = await getResponse.text();
          console.log(`📄 Response:`, text);
        }
      }
    } else {
      const text = await createResponse.text();
      console.log(`📄 Response:`, text);
    }

    // Test GET all activities
    console.log(`\n🔍 Testing GET ${API_BASE_URL}/api/activities`);
    const getAllResponse = await fetch(`${API_BASE_URL}/api/activities`);
    console.log(`📊 Status: ${getAllResponse.status} ${getAllResponse.statusText}`);

    if (getAllResponse.ok) {
      const getAllData = await getAllResponse.json();
      console.log(`📄 Response: Found ${getAllData.length} activities`);
      // Don't print all activities to avoid console clutter
    } else {
      const text = await getAllResponse.text();
      console.log(`📄 Response:`, text);
    }

  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

// Run the tests
testAPI();
