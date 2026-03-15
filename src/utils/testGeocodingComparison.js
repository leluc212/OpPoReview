// Test và so sánh các geocoding service
// Chạy trong browser console để test

const testAddresses = [
  'số 47 đường 5B, Long Bình, Thủ Đức',
  '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
  'Chợ Bến Thành, Quận 1, TP.HCM',
  '456 Lê Văn Việt, Quận 9, TP.HCM',
  'Đại học Bách Khoa, Quận 10, TP.HCM'
];

export const testGoogleMaps = async (address) => {
  try {
    const { default: service } = await import('../services/geocodingService');
    
    if (!service.isConfigured()) {
      return { error: 'Google Maps API key not configured' };
    }
    
    const start = Date.now();
    const result = await service.geocodeAddress(address);
    const responseTime = Date.now() - start;
    
    return {
      ...result,
      responseTime,
      service: 'Google Maps'
    };
  } catch (error) {
    return { error: error.message, service: 'Google Maps' };
  }
};

export const testOpenStreetMap = async (address) => {
  try {
    const { default: service } = await import('../services/openStreetMapService');
    
    const start = Date.now();
    const result = await service.geocodeAddress(address);
    const responseTime = Date.now() - start;
    
    return {
      ...result,
      responseTime,
      service: 'OpenStreetMap'
    };
  } catch (error) {
    return { error: error.message, service: 'OpenStreetMap' };
  }
};

export const testHybridService = async (address) => {
  try {
    const { default: service } = await import('../services/hybridGeocodingService');
    
    const start = Date.now();
    const result = await service.geocodeAddress(address);
    const responseTime = Date.now() - start;
    
    return {
      ...result,
      responseTime,
      service: 'Hybrid'
    };
  } catch (error) {
    return { error: error.message, service: 'Hybrid' };
  }
};

export const compareAllServices = async (address) => {
  console.log(`\n🧪 Testing address: "${address}"`);
  console.log('=' .repeat(50));
  
  const results = {};
  
  // Test Google Maps
  console.log('🔍 Testing Google Maps...');
  results.google = await testGoogleMaps(address);
  console.log('Google Maps:', results.google);
  
  // Wait 1 second for OSM rate limit
  console.log('⏳ Waiting for rate limit...');
  await new Promise(resolve => setTimeout(resolve, 1100));
  
  // Test OpenStreetMap
  console.log('🔍 Testing OpenStreetMap...');
  results.osm = await testOpenStreetMap(address);
  console.log('OpenStreetMap:', results.osm);
  
  // Test Hybrid
  console.log('🔍 Testing Hybrid Service...');
  results.hybrid = await testHybridService(address);
  console.log('Hybrid:', results.hybrid);
  
  // Compare results
  if (results.google && !results.google.error && 
      results.osm && !results.osm.error) {
    
    const distance = calculateDistance(
      results.google.lat, results.google.lng,
      results.osm.lat, results.osm.lng
    );
    
    console.log('\n📊 Comparison:');
    console.log(`Distance difference: ${distance.toFixed(2)} km`);
    console.log(`Response time - Google: ${results.google.responseTime}ms, OSM: ${results.osm.responseTime}ms`);
    console.log(`Accuracy: ${distance < 0.1 ? 'Very close' : distance < 1 ? 'Close' : 'Significant difference'}`);
  }
  
  return results;
};

export const runFullComparison = async () => {
  console.log('🚀 Starting full geocoding comparison...');
  console.log('This will test all addresses with all services');
  console.log('⚠️ This may take a while due to rate limiting\n');
  
  const allResults = [];
  
  for (const address of testAddresses) {
    const result = await compareAllServices(address);
    allResults.push({
      address,
      ...result
    });
    
    // Wait between addresses to respect rate limits
    console.log('⏳ Waiting before next address...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Summary
  console.log('📋 SUMMARY:');
  console.log('=' .repeat(60));
  
  allResults.forEach((result, index) => {
    console.log(`${index + 1}. ${result.address}`);
    
    if (result.google && !result.google.error) {
      console.log(`   Google: ✅ ${result.google.responseTime}ms`);
    } else {
      console.log(`   Google: ❌ ${result.google?.error || 'Failed'}`);
    }
    
    if (result.osm && !result.osm.error) {
      console.log(`   OSM: ✅ ${result.osm.responseTime}ms`);
    } else {
      console.log(`   OSM: ❌ ${result.osm?.error || 'Failed'}`);
    }
    
    if (result.hybrid && !result.hybrid.error) {
      console.log(`   Hybrid: ✅ ${result.hybrid.responseTime}ms (${result.hybrid.source})`);
    } else {
      console.log(`   Hybrid: ❌ ${result.hybrid?.error || 'Failed'}`);
    }
    
    console.log('');
  });
  
  return allResults;
};

// Helper function
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Usage examples:
// import { compareAllServices, runFullComparison } from './src/utils/testGeocodingComparison.js';
// compareAllServices('số 47 đường 5B, Long Bình, Thủ Đức');
// runFullComparison();