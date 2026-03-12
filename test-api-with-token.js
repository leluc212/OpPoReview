// Test Employer Profile API with mock Cognito token
const API_URL = 'https://dlidp35x33.execute-api.ap-southeast-1.amazonaws.com/prod';

// Mock JWT token (in real app, this comes from Cognito)
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

async function testAPI() {
  console.log('Testing Employer Profile API...');
  console.log('API URL:', API_URL);
  console.log('');

  try {
    // Test 1: CORS preflight
    console.log('1. Testing CORS preflight (OPTIONS)...');
    const optionsResponse = await fetch(`${API_URL}/profile/test-user`, {
      method: 'OPTIONS',
      headers: {
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Authorization'
      }
    });
    console.log('   Status:', optionsResponse.status);
    console.log('   CORS Headers:');
    console.log('   - Allow-Origin:', optionsResponse.headers.get('access-control-allow-origin'));
    console.log('   - Allow-Methods:', optionsResponse.headers.get('access-control-allow-methods'));
    console.log('   - Allow-Headers:', optionsResponse.headers.get('access-control-allow-headers'));
    console.log('');

    // Test 2: GET profile without token (should fail)
    console.log('2. Testing GET /profile/{userId} without token...');
    try {
      const getResponse = await fetch(`${API_URL}/profile/test-user-123`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const getData = await getResponse.json();
      console.log('   Status:', getResponse.status);
      console.log('   Response:', getData);
    } catch (error) {
      console.log('   Error:', error.message);
    }
    console.log('');

    // Test 3: GET profile with token
    console.log('3. Testing GET /profile/{userId} with token...');
    try {
      const getResponse = await fetch(`${API_URL}/profile/test-user-123`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`
        }
      });
      const getData = await getResponse.json();
      console.log('   Status:', getResponse.status);
      console.log('   Response:', getData);
    } catch (error) {
      console.log('   Error:', error.message);
    }
    console.log('');

    // Test 4: POST create profile
    console.log('4. Testing POST /profile (create)...');
    try {
      const postResponse = await fetch(`${API_URL}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`
        },
        body: JSON.stringify({
          userId: 'test-user-123',
          companyName: 'Test Company',
          email: 'test@example.com',
          phone: '0123456789',
          address: 'Test Address',
          industry: 'Technology',
          companySize: '11-50',
          description: 'Test company description'
        })
      });
      const postData = await postResponse.json();
      console.log('   Status:', postResponse.status);
      console.log('   Response:', postData);
    } catch (error) {
      console.log('   Error:', error.message);
    }
    console.log('');

    console.log('API tests completed!');

  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testAPI();
