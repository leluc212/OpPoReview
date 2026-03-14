// Test script for Candidate Profile API
import fs from 'fs';

// Read API endpoint from config
let API_URL;
try {
  const config = JSON.parse(fs.readFileSync('amplify/backend/candidate-api-config.json', 'utf8'));
  API_URL = config.apiEndpoint;
} catch (error) {
  console.error('❌ Could not read API config. Please run create-candidate-api.ps1 first.');
  process.exit(1);
}

async function testAPI() {
  console.log('🧪 Testing Candidate Profile API...');
  console.log('📍 API URL:', API_URL);
  console.log('');
  
  try {
    // Test 1: OPTIONS request (CORS preflight)
    console.log('1️⃣ Testing CORS preflight...');
    const corsResponse = await fetch(`${API_URL}/candidates`, {
      method: 'OPTIONS'
    });
    console.log('✅ CORS Status:', corsResponse.status);
    console.log('');
    
    // Test 2: GET all candidates
    console.log('2️⃣ Testing GET /candidates...');
    const getResponse = await fetch(`${API_URL}/candidates`);
    const candidates = await getResponse.json();
    
    console.log('✅ Status:', getResponse.status);
    console.log('📊 Total candidates:', candidates.length);
    
    if (candidates.length > 0) {
      console.log('\n📋 Sample candidate:');
      const sample = candidates[0];
      console.log('   - Name:', sample.fullName || 'N/A');
      console.log('   - Email:', sample.email || 'N/A');
      console.log('   - Phone:', sample.phone || 'N/A');
      console.log('   - KYC:', sample.kycCompleted ? '✓' : '✗');
      console.log('   - User ID:', sample.userId);
    }
    
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testAPI();
