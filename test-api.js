
// API Test Script
import fetch from 'node-fetch';
import { insertActivitySchema } from './shared/schema.js';
import dotenv from 'dotenv';

dotenv.config();

// Configuration 
const API_BASE_URL = process.env.VERCEL_URL || 'https://mammothzy-git-main-kartikeyas-xs-projects.vercel.app';
const TESTS = {
  runAll: true,
  getEcho: true,
  getHealthcheck: true,
  getDebugDb: true,
  postActivity: true
};

async function runTests() {
  console.log(`🧪 Running API tests against ${API_BASE_URL}`);
  
  try {
    // Test 1: GET /api/echo
    if (TESTS.runAll || TESTS.getEcho) {
      console.log('\n📡 Testing GET /api/echo');
      const echoResponse = await fetch(`${API_BASE_URL}/api/echo?test=true`);
      if (echoResponse.ok) {
        const echoData = await echoResponse.json();
        console.log('✅ Success:', echoData);
      } else {
        console.log(`❌ Failed: ${echoResponse.status} ${echoResponse.statusText}`);
        console.log(await echoResponse.text());
      }
    }
    
    // Test 2: GET /api/healthcheck
    if (TESTS.runAll || TESTS.getHealthcheck) {
      console.log('\n📡 Testing GET /api/healthcheck');
      const healthResponse = await fetch(`${API_BASE_URL}/api/healthcheck`);
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log('✅ Success:', healthData);
      } else {
        console.log(`❌ Failed: ${healthResponse.status} ${healthResponse.statusText}`);
        console.log(await healthResponse.text());
      }
    }
    
    // Test 3: GET /api/debug-db
    if (TESTS.runAll || TESTS.getDebugDb) {
      console.log('\n📡 Testing GET /api/debug-db');
      const debugResponse = await fetch(`${API_BASE_URL}/api/debug-db`);
      if (debugResponse.ok) {
        const debugData = await debugResponse.json();
        console.log('✅ Success:', debugData);
      } else {
        console.log(`❌ Failed: ${debugResponse.status} ${debugResponse.statusText}`);
        console.log(await debugResponse.text());
      }
    }
    
    // Test 4: POST /api/activities
    if (TESTS.runAll || TESTS.postActivity) {
      console.log('\n📡 Testing POST /api/activities');
      
      const testActivity = {
        name: `Test Activity ${new Date().toISOString()}`,
        category: "API Testing",
        description: "This is a test activity created by the API test script",
        activity_type: "test",
        location_type: "virtual",
        min_members: 1,
        max_members: 10,
        address_line_1: "123 Test St",
        city: "Testville",
        state: "TS",
        contact_name: "Test User"
      };
      
      console.log('📦 Sending data:', testActivity);
      
      const createResponse = await fetch(`${API_BASE_URL}/api/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testActivity)
      });
      
      if (createResponse.ok) {
        const createdActivity = await createResponse.json();
        console.log('✅ Success:', createdActivity);
      } else {
        console.log(`❌ Failed: ${createResponse.status} ${createResponse.statusText}`);
        try {
          const errorText = await createResponse.text();
          console.log('Error response:', errorText);
          try {
            const errorJson = JSON.parse(errorText);
            console.log('Parsed error:', errorJson);
          } catch (e) {
            // Not JSON, which is fine
          }
        } catch (e) {
          console.log('Could not read response text');
        }
      }
    }
  } catch (error) {
    console.error('❌ Test execution error:', error);
  }
}

runTests();
