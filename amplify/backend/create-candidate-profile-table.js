#!/usr/bin/env node

/**
 * Script to create CandidateProfiles DynamoDB table
 * Run: node amplify/backend/create-candidate-profile-table.js
 */

const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');

// Configuration
const TABLE_NAME = 'CandidateProfiles';
const REGION = process.env.AWS_REGION || 'ap-southeast-1';

const client = new DynamoDBClient({ region: REGION });

const tableParams = {
  TableName: TABLE_NAME,
  KeySchema: [
    { AttributeName: 'userId', KeyType: 'HASH' } // Partition key
  ],
  AttributeDefinitions: [
    { AttributeName: 'userId', AttributeType: 'S' },
    { AttributeName: 'email', AttributeType: 'S' }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'EmailIndex',
      KeySchema: [
        { AttributeName: 'email', KeyType: 'HASH' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      }
    }
  ],
  BillingMode: 'PAY_PER_REQUEST', // On-demand billing
  StreamSpecification: {
    StreamEnabled: true,
    StreamViewType: 'NEW_AND_OLD_IMAGES'
  },
  Tags: [
    { Key: 'Environment', Value: process.env.ENV || 'dev' },
    { Key: 'Application', Value: 'OppoReview' },
    { Key: 'Purpose', Value: 'CandidateProfileManagement' }
  ]
};

async function checkTableExists() {
  try {
    const command = new DescribeTableCommand({ TableName: TABLE_NAME });
    await client.send(command);
    return true;
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      return false;
    }
    throw error;
  }
}

async function createTable() {
  try {
    console.log(`🔍 Checking if table "${TABLE_NAME}" exists...`);
    
    const exists = await checkTableExists();
    
    if (exists) {
      console.log(`✅ Table "${TABLE_NAME}" already exists!`);
      console.log(`📍 Region: ${REGION}`);
      console.log(`🔗 Console URL: https://${REGION}.console.aws.amazon.com/dynamodbv2/home?region=${REGION}#table?name=${TABLE_NAME}`);
      return;
    }

    console.log(`📝 Creating table "${TABLE_NAME}"...`);
    
    const command = new CreateTableCommand(tableParams);
    const response = await client.send(command);
    
    console.log(`✅ Table "${TABLE_NAME}" created successfully!`);
    console.log(`📍 Region: ${REGION}`);
    console.log(`🔗 Console URL: https://${REGION}.console.aws.amazon.com/dynamodbv2/home?region=${REGION}#table?name=${TABLE_NAME}`);
    console.log('\n📊 Table Details:');
    console.log(`   - Table ARN: ${response.TableDescription.TableArn}`);
    console.log(`   - Table Status: ${response.TableDescription.TableStatus}`);
    console.log(`   - Billing Mode: PAY_PER_REQUEST`);
    console.log(`   - Stream Enabled: Yes`);
    console.log('\n⏳ Table is being created. It may take a few moments to become ACTIVE.');
    console.log('   You can check the status in the AWS Console or run this script again.');
    
  } catch (error) {
    console.error('❌ Error creating table:', error.message);
    
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️  Table already exists. No action needed.');
    } else if (error.name === 'UnrecognizedClientException') {
      console.log('\n⚠️  AWS credentials not configured properly.');
      console.log('   Please run: aws configure');
      console.log('   Or set environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY');
    } else {
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Make sure AWS CLI is configured: aws configure');
      console.log('   2. Check your AWS credentials have DynamoDB permissions');
      console.log('   3. Verify the region is correct');
    }
    
    process.exit(1);
  }
}

// Run the script
console.log('🚀 DynamoDB Table Creation Script');
console.log('==================================\n');
createTable();
