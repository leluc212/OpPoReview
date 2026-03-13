# Create Applications DynamoDB Table

Write-Host "Creating Applications DynamoDB table..." -ForegroundColor Cyan

$REGION = "ap-southeast-1"
$TABLE_NAME = "StandardApplications"

# Check if table exists
Write-Host "`nChecking if table exists..." -ForegroundColor Yellow
$existingTable = aws dynamodb describe-table --table-name $TABLE_NAME --region $REGION 2>$null

if ($existingTable) {
    Write-Host "Table already exists!" -ForegroundColor Green
    exit 0
}

Write-Host "Creating table..." -ForegroundColor Yellow

# Create table with GSI indexes
aws dynamodb create-table `
    --table-name $TABLE_NAME `
    --attribute-definitions `
        AttributeName=applicationId,AttributeType=S `
        AttributeName=candidateId,AttributeType=S `
        AttributeName=jobId,AttributeType=S `
        AttributeName=employerId,AttributeType=S `
    --key-schema `
        AttributeName=applicationId,KeyType=HASH `
    --global-secondary-indexes `
        "[
            {
                \"IndexName\": \"CandidateIndex\",
                \"KeySchema\": [{\"AttributeName\":\"candidateId\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}
            },
            {
                \"IndexName\": \"JobIndex\",
                \"KeySchema\": [{\"AttributeName\":\"jobId\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}
            },
            {
                \"IndexName\": \"EmployerIndex\",
                \"KeySchema\": [{\"AttributeName\":\"employerId\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}
            }
        ]" `
    --provisioned-throughput `
        ReadCapacityUnits=5,WriteCapacityUnits=5 `
    --region $REGION

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Table creation initiated" -ForegroundColor Green
    Write-Host "`nWaiting for table to become active..." -ForegroundColor Yellow
    
    # Wait for table to be active
    aws dynamodb wait table-exists --table-name $TABLE_NAME --region $REGION
    
    Write-Host "✓ Table is now active!" -ForegroundColor Green
} else {
    Write-Host "`n✗ Failed to create table" -ForegroundColor Red
    exit 1
}

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "Applications Table Created Successfully!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "`nTable: $TABLE_NAME" -ForegroundColor Cyan
Write-Host "Region: $REGION" -ForegroundColor Cyan
Write-Host "`nIndexes:" -ForegroundColor Yellow
Write-Host "  - CandidateIndex (by candidateId)" -ForegroundColor White
Write-Host "  - JobIndex (by jobId)" -ForegroundColor White
Write-Host "  - EmployerIndex (by employerId)" -ForegroundColor White
