# Check PostQuickJob table data
Write-Host "=== Checking PostQuickJob Table ===" -ForegroundColor Cyan

# Get table description
Write-Host "`n1. Table Info:" -ForegroundColor Yellow
aws dynamodb describe-table --table-name PostQuickJob --query "Table.[TableName,TableStatus,ItemCount,AttributeDefinitions,GlobalSecondaryIndexes[*].[IndexName,IndexStatus]]" --output table

# Scan table to see all items
Write-Host "`n2. All Items in Table:" -ForegroundColor Yellow
aws dynamodb scan --table-name PostQuickJob --output json | ConvertFrom-Json | ConvertTo-Json -Depth 10

# Count items
Write-Host "`n3. Item Count:" -ForegroundColor Yellow
$items = aws dynamodb scan --table-name PostQuickJob --select COUNT --output json | ConvertFrom-Json
Write-Host "Total items: $($items.Count)" -ForegroundColor Green

Write-Host "`n=== Check Complete ===" -ForegroundColor Cyan
