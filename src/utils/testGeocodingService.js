// Test file for Geocoding Service
// Run this in browser console to test the geocoding functionality

import geocodingService from '../services/geocodingService';

// Test addresses in Vietnam
const testAddresses = [
  'số 47 đường 5B, Long Bình, Thủ Đức',
  '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
  '456 Lê Văn Việt, Quận 9, TP.HCM',
  'Chợ Bến Thành, Quận 1, TP.HCM',
  'Đại học Bách Khoa, Quận 10, TP.HCM'
];

// Test geocoding function
export const testGeocoding = async () => {
  console.log('🧪 Testing Geocoding Service...');
  
  if (!geocodingService.isConfigured()) {
    console.error('❌ Google Maps API key not configured');
    return;
  }
  
  for (const address of testAddresses) {
    try {
      console.log(`\n🔍 Testing: ${address}`);
      const result = await geocodingService.geocodeAddress(address);
      console.log('✅ Success:', {
        lat: result.lat,
        lng: result.lng,
        formatted: result.formattedAddress
      });
    } catch (error) {
      console.error('❌ Failed:', error.message);
    }
  }
};

// Test places search
export const testPlacesSearch = async (query = 'Long Bình Thủ Đức') => {
  console.log(`🔍 Testing Places Search: ${query}`);
  
  try {
    const results = await geocodingService.searchPlaces(query);
    console.log('✅ Search results:', results);
  } catch (error) {
    console.error('❌ Search failed:', error.message);
  }
};

// Usage in browser console:
// import { testGeocoding, testPlacesSearch } from './src/utils/testGeocodingService.js';
// testGeocoding();
// testPlacesSearch('Thủ Đức');