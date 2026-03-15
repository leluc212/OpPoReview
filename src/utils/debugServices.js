// Debug utility to test services
// Run this in browser console to debug issues

export const testGeocodingService = async () => {
  try {
    console.log('🧪 Testing Geocoding Service...');
    
    // Dynamic import to avoid build issues
    const { default: geocodingService } = await import('../services/geocodingService');
    
    console.log('✅ Service imported successfully');
    console.log('🔑 API configured:', geocodingService.isConfigured());
    
    if (geocodingService.isConfigured()) {
      const testAddress = 'Chợ Bến Thành, Quận 1, TP.HCM';
      console.log(`🔍 Testing geocoding: ${testAddress}`);
      
      const result = await geocodingService.geocodeAddress(testAddress);
      console.log('✅ Geocoding result:', result);
    } else {
      console.log('⚠️ API key not configured - this is expected if you haven\'t set up Google Maps API yet');
    }
  } catch (error) {
    console.error('❌ Geocoding service test failed:', error);
  }
};

export const testQuickJobService = async () => {
  try {
    console.log('🧪 Testing Quick Job Service...');
    
    const { default: quickJobService } = await import('../services/quickJobService');
    console.log('✅ Quick Job Service imported successfully');
    
    // Test getting jobs (read operation)
    const jobs = await quickJobService.getAllActiveQuickJobs();
    console.log('✅ Active quick jobs:', jobs);
  } catch (error) {
    console.error('❌ Quick Job service test failed:', error);
  }
};

export const testJobPostService = async () => {
  try {
    console.log('🧪 Testing Job Post Service...');
    
    const { default: jobPostService } = await import('../services/jobPostService');
    console.log('✅ Job Post Service imported successfully');
    
    // Test getting jobs (read operation)
    const jobs = await jobPostService.getAllActiveJobs();
    console.log('✅ Active job posts:', jobs);
  } catch (error) {
    console.error('❌ Job Post service test failed:', error);
  }
};

export const runAllTests = async () => {
  console.log('🚀 Running all service tests...');
  
  await testGeocodingService();
  await testQuickJobService();
  await testJobPostService();
  
  console.log('✅ All tests completed');
};

// Usage in browser console:
// import { runAllTests } from './src/utils/debugServices.js';
// runAllTests();