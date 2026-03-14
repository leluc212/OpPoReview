// Get all Employer Profile data from DynamoDB
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import fs from 'fs';

const client = new DynamoDBClient({ region: 'ap-southeast-1' });
const docClient = DynamoDBDocumentClient.from(client);

const tableName = 'EmployerProfiles';
const outputFile = 'employer-profiles-data.json';

async function getAllEmployerProfiles() {
  console.log('Retrieving Employer Profile Data...\n');
  console.log(`Table: ${tableName}`);
  console.log(`Region: ap-southeast-1\n`);

  try {
    console.log('Fetching data...');
    
    const command = new ScanCommand({
      TableName: tableName
    });

    const response = await docClient.send(command);
    const items = response.Items || [];

    console.log(`\nFound ${items.length} employer profile(s)\n`);

    if (items.length === 0) {
      console.log('No data found in the table');
      return;
    }

    // Save to file
    console.log(`Saving data to: ${outputFile}`);
    fs.writeFileSync(outputFile, JSON.stringify(items, null, 2), 'utf8');
    console.log('Data saved successfully!\n');

    // Display summary
    console.log('Employer Profiles:');
    console.log('='.repeat(80));
    
    items.forEach((item, index) => {
      console.log(`\n${index + 1}. Company: ${item.companyName || 'N/A'}`);
      console.log(`   Email: ${item.email || 'N/A'}`);
      console.log(`   Status: ${item.approvalStatus || 'N/A'}`);
      console.log(`   User ID: ${item.userId || 'N/A'}`);
      console.log(`   Phone: ${item.phoneNumber || 'N/A'}`);
      console.log(`   Industry: ${item.industry || 'N/A'}`);
      console.log(`   Created: ${item.createdAt || 'N/A'}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log(`\nDone! Check ${outputFile} for complete data.`);

  } catch (error) {
    console.error('\nError:', error.message);
    console.error('\nMake sure:');
    console.error('  1. AWS SDK is installed (npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb)');
    console.error('  2. You have proper AWS credentials configured');
    console.error('  3. You have permission to access DynamoDB');
    console.error('  4. The table name and region are correct');
    process.exit(1);
  }
}

getAllEmployerProfiles();
