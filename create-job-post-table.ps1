# PowerShell script to create PostStandardJob DynamoDB table
# Run this script to create the table with proper indexes

Write-Host "Creating PostStandardJob DynamoDB table..." -ForegroundColor Cyan

# Table name
$tableName = "PostStandardJob"

# Create table with GSIs
aws dynamodb create-table `
    --table-name $tableName `
    --attribute-definitions `
        AttributeName=idJob,AttributeType=S `
        AttributeName=employerId,AttributeType=S `
        AttributeName=status,AttributeType=S `
        AttributeName=createdAt,AttributeType=S `
    --key-schema `
        AttributeName=idJob,KeyType=HASH `
    --billing-mode PAY_PER_REQUEST `
    --global-secondary-indexes `
        "[
            {
                \"IndexName\": \"EmployerIndex\",
                \"KeySchema\": [
                    {\"AttributeName\": \"employerId\", \"KeyType\": \"HASH\"},
                    {\"AttributeName\": \"createdAt\", \"KeyType\": \"RANGE\"}
                ],
                \"Projection\": {
                    \"ProjectionType\": \"ALL\"
                }
            },
            {
                \"IndexName\": \"StatusIndex\",
                \"KeySchema\": [
                    {\"AttributeName\": \"status\", \"KeyType\": \"HASH\"},
                    {\"AttributeName\": \"createdAt\", \"KeyType\": \"RANGE\"}
                ],
                \"Projection\": {
                    \"ProjectionType\": \"ALL\"
                }
            }
        ]" `
    --region ap-southeast-1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Table created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Waiting for table to become active..." -ForegroundColor Yellow
    
    # Wait for table to be active
    aws dynamodb wait table-exists --table-name $tableName --region ap-southeast-1
    
    Write-Host "✅ Table is now active!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Table details:" -ForegroundColor Cyan
    aws dynamodb describe-table --table-name $tableName --region ap-southeast-1 --query "Table.[TableName,TableStatus,ItemCount]" --output table
} else {
    Write-Host "❌ Error creating table" -ForegroundColor Red
    Write-Host "The table might already exist. Check with:" -ForegroundColor Yellow
    Write-Host "aws dynamodb describe-table --table-name $tableName --region ap-southeast-1" -ForegroundColor Yellow
}
