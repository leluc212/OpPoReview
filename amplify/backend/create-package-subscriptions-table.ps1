# Create PackageSubscriptions DynamoDB table
$TABLE_NAME = "PackageSubscriptions"
$REGION = "ap-southeast-1"

Write-Host "Creating PackageSubscriptions DynamoDB table..." -ForegroundColor Cyan
Write-Host ""

# Check if table already exists
Write-Host "Checking if table exists..." -ForegroundColor Yellow
$tableExists = aws dynamodb describe-table --table-name $TABLE_NAME --region $REGION 2>$null

if ($tableExists) {
    Write-Host "✅ Table already exists!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Table details:" -ForegroundColor White
    aws dynamodb describe-table --table-name $TABLE_NAME --region $REGION --query 'Table.[TableName,TableStatus,ItemCount]' --output table
    exit 0
}

Write-Host "Creating new table..." -ForegroundColor Yellow

# Create table
aws dynamodb create-table `
    --table-name $TABLE_NAME `
    --attribute-definitions `
        AttributeName=subscriptionId,AttributeType=S `
        AttributeName=employerId,AttributeType=S `
        AttributeName=purchaseDate,AttributeType=S `
    --key-schema `
        AttributeName=subscriptionId,KeyType=HASH `
    --billing-mode PAY_PER_REQUEST `
    --global-secondary-indexes `
        "IndexName=EmployerIndex,KeySchema=[{AttributeName=employerId,KeyType=HASH},{AttributeName=purchaseDate,KeyType=RANGE}],Projection={ProjectionType=ALL}" `
    --region $REGION `
    --tags Key=Project,Value=OpPoReview Key=Environment,Value=Production

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Table created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Waiting for table to be active..." -ForegroundColor Yellow
    
    aws dynamodb wait table-exists --table-name $TABLE_NAME --region $REGION
    
    Write-Host "✅ Table is now active!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Table details:" -ForegroundColor White
    aws dynamodb describe-table --table-name $TABLE_NAME --region $REGION --query 'Table.[TableName,TableStatus,ItemCount]' --output table
} else {
    Write-Host "❌ Failed to create table" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run deploy-package-subscriptions-api.ps1 to create Lambda and API Gateway" -ForegroundColor White
Write-Host "2. Test API using test-package-subscriptions-api.ps1" -ForegroundColor White
