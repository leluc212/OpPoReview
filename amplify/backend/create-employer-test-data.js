// Script to create test employer profile in DynamoDB
// Run this with: node amplify/backend/create-employer-test-data.js

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');

const dynamoDb = DynamoDBDocument.from(new DynamoDB({
  region: 'ap-southeast-1'
}));

const tableName = 'EmployerProfiles';

async function createTestEmployerProfile() {
  const testProfile = {
    userId: 'd6ea038c-2041-7096-db0d-7128bc65c6c2', // Replace with your actual Cognito user ID
    companyName: 'Katinat Quận 8',
    email: 'contact@katinat.vn',
    phone: '0379784509',
    address: 'Quận 8, TP.HCM',
    website: 'https://katinat.vn',
    industry: 'F&B',
    companySize: '50-100 nhân viên',
    foundedYear: '2020',
    description: 'Hệ thống cửa hàng cà phê và trà Katinat.',
    companyLogo: '',
    taxCode: '0123456789',
    businessLicense: 'GP-2020-12345',
    profileCompletion: 85,
    isActive: true,
    isVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    console.log('📝 Creating test employer profile...');
    console.log('Table:', tableName);
    console.log('Data:', JSON.stringify(testProfile, null, 2));

    const result = await dynamoDb.put({
      TableName: tableName,
      Item: testProfile
    });

    console.log('✅ Test employer profile created successfully!');
    console.log('Result:', result);
    
    // Verify the item was created
    const getResult = await dynamoDb.get({
      TableName: tableName,
      Key: { userId: testProfile.userId }
    });
    
    console.log('\n📋 Verification - Item retrieved:');
    console.log(JSON.stringify(getResult.Item, null, 2));
    
  } catch (error) {
    console.error('❌ Error creating test profile:', error);
    throw error;
  }
}

// Run the function
createTestEmployerProfile()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
