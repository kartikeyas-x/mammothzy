
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000';

async function testCreateActivity() {
  const testActivity = {
    name: "Test Activity",
    category: "Testing",
    description: "This is a test activity",
    activity_type: "Indoor", // Explicitly set this field
    location_type: "In-person", // Explicitly set this field
    min_members: 1,
    max_members: 10,
    address_line_1: "123 Test Street", // Include this required field
    zip_code: "12345", // Include this required field
    city: "Test City",
    state: "Test State",
    contact_number: "555-123-4567", // Required field
    contact_name: "Test Contact" // Required field
  };

  try {
    console.log(`\n🔍 Testing POST ${API_BASE_URL}/api/activities`);
    console.log(`📄 Sending payload:`, JSON.stringify(testActivity, null, 2));
    
    const createResponse = await fetch(`${API_BASE_URL}/api/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testActivity)
    });
    
    console.log(`📊 Status: ${createResponse.status} ${createResponse.statusText}`);
    
    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log(`✅ Activity created successfully:`, JSON.stringify(createData, null, 2));
    } else {
      try {
        const errorData = await createResponse.json();
        console.log(`❌ Creation failed:`, JSON.stringify(errorData, null, 2));
      } catch {
        const text = await createResponse.text();
        console.log(`❌ Creation failed (text):`, text);
      }
    }
  } catch (error) {
    console.error(`❌ Request failed:`, error.message);
  }
}

testCreateActivity();
