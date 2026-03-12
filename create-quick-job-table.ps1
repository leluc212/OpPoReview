# PowerShell script to create PostQuickJob DynamoDB table
# Table for quick/urgent job postings

Write-Host "🚀 Creating PostQuickJob DynamoDB table..." -ForegroundColor Cyan

# Create the table
aws dynamodb create-table `
    --table-name PostQuickJob `
    --attribute-definitions `
        AttributeName=idJob,AttributeType=S `
        AttributeName=employerId,AttributeType=S `
        AttributeName=createdAt,AttributeType=S `
        AttributeName=status,AttributeType=S `
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
                \"Projection\": {\"ProjectionType\": \"ALL\"}
            },
            {
                \"IndexName\": \"StatusIndex\",
                \"KeySchema\": [
                    {\"AttributeName\": \"status\", \"KeyType\": \"HASH\"},
                    {\"AttributeName\": \"createdAt\", \"KeyType\": \"RANGE\"}
                ],
                \"Projection\": {\"ProjectionType\": \"ALL\"}
            }
        ]" `
    --region ap-southeast-1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ PostQuickJob table created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⏳ Waiting for table to become active..." -ForegroundColor Yellow
    
    # Wait for table to be active
    aws dynamodb wait table-exists --table-name PostQuickJob --region ap-southeast-1
    
    Write-Host "✅ Table is now active!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Table details:" -ForegroundColor Cyan
    aws dynamodb describe-table --table-name PostQuickJob --region ap-southeast-1 --query "Table.[TableName,TableStatus,ItemCount]" --output table
} else {
    Write-Host "❌ Failed to create table" -ForegroundColor Red
    Write-Host "Note: If table already exists, you can skip this step" -ForegroundColor Yellow
}
