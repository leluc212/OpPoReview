// Watch and update Employer Profile data in realtime
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import fs from 'fs';

const client = new DynamoDBClient({ region: 'ap-southeast-1' });
const docClient = DynamoDBDocumentClient.from(client);

const tableName = 'EmployerProfiles';
const outputFile = 'employer-profiles-data.json';
const updateInterval = 5000; // 5 seconds

let previousData = null;

async function fetchEmployerProfiles() {
  try {
    const command = new ScanCommand({
      TableName: tableName
    });

    const response = await docClient.send(command);
    return response.Items || [];
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return null;
  }
}

function hasDataChanged(newData) {
  if (!previousData) return true;
  return JSON.stringify(newData) !== JSON.stringify(previousData);
}

async function updateData() {
  const items = await fetchEmployerProfiles();
  
  if (!items) {
    console.log(`[${new Date().toLocaleTimeString()}] Failed to fetch data`);
    return;
  }

  if (hasDataChanged(items)) {
    fs.writeFileSync(outputFile, JSON.stringify(items, null, 2), 'utf8');
    console.log(`[${new Date().toLocaleTimeString()}] Data updated! Found ${items.length} profiles`);
    
    // Show changes
    items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.companyName || 'N/A'} - ${item.email || 'N/A'} (${item.approvalStatus || 'N/A'})`);
    });
    
    previousData = items;
  } else {
    console.log(`[${new Date().toLocaleTimeString()}] No changes detected`);
  }
}

console.log('Starting realtime watch for EmployerProfiles...');
console.log(`Update interval: ${updateInterval / 1000} seconds`);
console.log(`Output file: ${outputFile}`);
console.log('Press Ctrl+C to stop\n');

// Initial fetch
await updateData();

// Start watching
setInterval(updateData, updateInterval);
