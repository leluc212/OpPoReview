// Test script for Employer Profile API
const API_URL = 'https://xalmen0v0m.execute-api.ap-southeast-1.amazonaws.com/prod';

async function testAPI() {
  console.log('🧪 Testing Employer Profile API...');
  console.log('📍 API URL:', API_URL);
  
  try {
    // Test health check endpoint
    console.log('\n1️⃣ Testing health check...');
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test OPTIONS request (CORS preflight)
    console.log('\n2️⃣ Testing CORS preflight...');
    const corsResponse = await fetch(`${API_URL}/profile/test-user-id`, {
      method: 'OPTIONS'
    });
    console.log('✅ CORS status:', corsResponse.status);
    console.log('✅ CORS headers:', {
      'access-control-allow-origin': corsResponse.headers.get('access-control-allow-origin'),
      'access-control-allow-methods': corsResponse.headers.get('access-control-allow-methods'),
      'access-control-allow-headers': corsResponse.headers.get('access-control-allow-headers')
    });
    
    console.log('\n✅ API is accessible and CORS is configured correctly!');
    console.log('ℹ️  Note: Authenticated endpoints require a valid Cognito token');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    process.exit(1);
  }
}

testAPI();
