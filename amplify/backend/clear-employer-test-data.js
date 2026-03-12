// Script to clear test employer profile from DynamoDB
// Run this with: node amplify/backend/clear-employer-test-data.js

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');

const dynamoDb = DynamoDBDocument.from(new DynamoDB({
  region: 'ap-southeast-1'
}));

const tableName = 'EmployerProfiles';

async function clearTestEmployerProfile() {
  const testUserId = 'd6ea038c-2041-7096-db0d-7128bc65c6c2';

  try {
    console.log('🗑️ Clearing test employer profile...');
    console.log('Table:', tableName);
    console.log('UserId:', testUserId);

    const result = await dynamoDb.delete({
      TableName: tableName,
      Key: { userId: testUserId }
    });

    console.log('✅ Test employer profile cleared successfully!');
    console.log('Result:', result);
    
    // Verify the item was deleted
    const getResult = await dynamoDb.get({
      TableName: tableName,
      Key: { userId: testUserId }
    });
    
    if (getResult.Item) {
      console.log('\n❌ Item still exists:', getResult.Item);
    } else {
      console.log('\n✅ Verification - Item successfully deleted');
    }
    
  } catch (error) {
    console.error('❌ Error clearing test profile:', error);
    throw error;
  }
}

// Run the function
clearTestEmployerProfile()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });