// Test OpenStreetMap với địa chỉ Việt Nam cụ thể
// Chạy trong browser console để test

const vietnameseAddresses = [
  // Địa chỉ cụ thể với số nhà
  'số 47 đường 5B, Long Bình, Thủ Đức',
  '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
  '456 Lê Văn Việt, Quận 9, TP.HCM',
  '789 Võ Văn Tần, Quận 3, TP.HCM',
  '321 Trần Hưng Đạo, Quận 1, TP.HCM',
  
  // Địa chỉ landmark
  'Chợ Bến Thành, Quận 1, TP.HCM',
  'Đại học Bách Khoa, Quận 10, TP.HCM',
  'Sân bay Tân Sơn Nhất, TP.HCM',
  'Bitexco Financial Tower, Quận 1, TP.HCM',
  'Vincom Center, Quận 1, TP.HCM',
  
  // Địa chỉ khu vực mới
  'Khu đô thị Vinhomes Grand Park, Quận 9, TP.HCM',
  'Landmark 81, Quận Bình Thạnh, TP.HCM',
  'Crescent Mall, Quận 7, TP.HCM',
  'Aeon Mall Tân Phú, Quận Tân Phú, TP.HCM',
  
  // Địa chỉ ngoại thành
  'Khu công nghiệp Tân Bình, Tây Ninh',
  'Đại học FPT, Thủ Đức, TP.HCM',
  'Khu công nghệ cao, Quận 9, TP.HCM'
];

export const testSingleAddress = async (address) => {
  try {
    console.log(`\n🔍 Testing: "${address}"`);
    
    const { default: osmService } = await import('../services/openStreetMapService');
    
    const startTime = Date.now();
    const result = await osmService.geocodeAddress(address);
    const responseTime = Date.now() - startTime;
    
    console.log('✅ Success:');
    console.log(`   Formatted: ${result.formattedAddress}`);
    console.log(`   Coordinates: ${result.lat.toFixed(6)}, ${result.lng.toFixed(6)}`);
    console.log(`   Response time: ${responseTime}ms`);
    
    return {
      address,
      success: true,
      result,
      responseTime
    };
  } catch (error) {
    console.log('❌ Failed:', error.message);
    return {
      address,
      success: false,
      error: error.message
    };
  }
};

export const testAllVietnameseAddresses = async () => {
  console.log('🇻🇳 Testing OpenStreetMap with Vietnamese addresses...');
  console.log('⚠️ This will take a while due to 1 second rate limit\n');
  
  const results = [];
  let successCount = 0;
  let totalTime = 0;
  
  for (let i = 0; i < vietnameseAddresses.length; i++) {
    const address = vietnameseAddresses[i];
    
    console.log(`[${i + 1}/${vietnameseAddresses.length}] Testing...`);
    
    const result = await testSingleAddress(address);
    results.push(result);
    
    if (result.success) {
      successCount++;
      totalTime += result.responseTime;
    }
    
    // Wait 1.1 seconds between requests to respect rate limit
    if (i < vietnameseAddresses.length - 1) {
      console.log('⏳ Waiting for rate limit...');
      await new Promise(resolve => setTimeout(resolve, 1100));
    }
  }
  
  // Summary
  console.log('\n📊 SUMMARY:');
  console.log('=' .repeat(60));
  console.log(`Total addresses tested: ${vietnameseAddresses.length}`);
  console.log(`Successful: ${successCount} (${(successCount/vietnameseAddresses.length*100).toFixed(1)}%)`);
  console.log(`Failed: ${vietnameseAddresses.length - successCount}`);
  console.log(`Average response time: ${(totalTime/successCount).toFixed(0)}ms`);
  
  // Detailed results
  console.log('\n📋 DETAILED RESULTS:');
  console.log('=' .repeat(60));
  
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.address}`);
    if (result.success) {
      console.log(`   ✅ ${result.result.lat.toFixed(6)}, ${result.result.lng.toFixed(6)} (${result.responseTime}ms)`);
      console.log(`   📍 ${result.result.formattedAddress}`);
    } else {
      console.log(`   ❌ ${result.error}`);
    }
    console.log('');
  });
  
  // Failed addresses
  const failedAddresses = results.filter(r => !r.success);
  if (failedAddresses.length > 0) {
    console.log('\n❌ FAILED ADDRESSES:');
    failedAddresses.forEach(failed => {
      console.log(`- ${failed.address}: ${failed.error}`);
    });
  }
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (successCount / vietnameseAddresses.length > 0.8) {
    console.log('✅ OpenStreetMap works well with Vietnamese addresses!');
    console.log('✅ Suitable for production use');
  } else if (successCount / vietnameseAddresses.length > 0.6) {
    console.log('⚠️ OpenStreetMap has moderate success rate');
    console.log('⚠️ Consider hybrid approach with Google Maps fallback');
  } else {
    console.log('❌ Low success rate with OpenStreetMap');
    console.log('❌ Consider using Google Maps as primary service');
  }
  
  return results;
};

export const testSpecificAddressTypes = async () => {
  console.log('🏢 Testing specific address types...\n');
  
  const addressTypes = {
    'Số nhà cụ thể': [
      'số 47 đường 5B, Long Bình, Thủ Đức',
      '123 Nguyễn Văn Linh, Quận 7, TP.HCM'
    ],
    'Landmark nổi tiếng': [
      'Chợ Bến Thành, Quận 1, TP.HCM',
      'Đại học Bách Khoa, Quận 10, TP.HCM'
    ],
    'Khu vực mới': [
      'Vinhomes Grand Park, Quận 9, TP.HCM',
      'Landmark 81, Quận Bình Thạnh, TP.HCM'
    ]
  };
  
  for (const [type, addresses] of Object.entries(addressTypes)) {
    console.log(`\n📍 ${type}:`);
    console.log('-'.repeat(40));
    
    for (const address of addresses) {
      await testSingleAddress(address);
      await new Promise(resolve => setTimeout(resolve, 1100));
    }
  }
};

export const compareAddressFormats = async () => {
  console.log('📝 Testing different address formats...\n');
  
  const addressFormats = [
    // Cùng một địa điểm, khác format
    'số 47 đường 5B, Long Bình, Thủ Đức',
    '47 đường 5B, Long Bình, Thủ Đức',
    '47 5B Street, Long Binh, Thu Duc',
    'đường 5B, Long Bình, Thủ Đức',
    'Long Bình, Thủ Đức',
    
    // Nguyễn Văn Linh với các format khác
    '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
    '123 Nguyen Van Linh, District 7, HCMC',
    'Nguyễn Văn Linh, Quận 7',
    'Nguyen Van Linh Street, District 7'
  ];
  
  const results = [];
  
  for (const address of addressFormats) {
    const result = await testSingleAddress(address);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1100));
  }
  
  // Analyze which formats work best
  console.log('\n📊 Format Analysis:');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful formats: ${successful.length}/${results.length}`);
  console.log(`❌ Failed formats: ${failed.length}/${results.length}`);
  
  if (failed.length > 0) {
    console.log('\n❌ Failed formats:');
    failed.forEach(f => console.log(`- ${f.address}`));
  }
  
  return results;
};

// Usage examples:
// import { testAllVietnameseAddresses, testSpecificAddressTypes } from './src/utils/testVietnameseAddresses.js';
// testAllVietnameseAddresses();
// testSpecificAddressTypes();
// compareAddressFormats();