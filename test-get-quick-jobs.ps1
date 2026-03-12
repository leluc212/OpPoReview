# Test getting quick jobs from DynamoDB

Write-Host "Testing Quick Jobs retrieval..." -ForegroundColor Cyan
Write-Host ""

# Get all items from table (scan)
Write-Host "1. Scanning all items in PostQuickJob table..." -ForegroundColor Yellow
aws dynamodb scan --table-name PostQuickJob --region ap-southeast-1 --query 'Items[*].[jobID,title,status,employerId]' --output table

Write-Host ""
Write-Host "2. Getting full data..." -ForegroundColor Yellow
aws dynamodb scan --table-name PostQuickJob --region ap-southeast-1 --max-items 5

Write-Host ""
Write-Host "3. Checking indexes..." -ForegroundColor Yellow
aws dynamodb describe-table --table-name PostQuickJob --region ap-southeast-1 --query 'Table.GlobalSecondaryIndexes[*].[IndexName,IndexStatus]' --output table
