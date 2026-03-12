# Quick check script for EmployerIndex status
Write-Host "Checking EmployerIndex status..." -ForegroundColor Cyan
Write-Host ""

$result = aws dynamodb describe-table `
    --table-name PostQuickJob `
    --region ap-southeast-1 `
    --query "Table.GlobalSecondaryIndexes[?IndexName=='EmployerIndex'].[IndexName,IndexStatus,Backfilling]" `
    --output json | ConvertFrom-Json

$indexName = $result[0][0]
$indexStatus = $result[0][1]
$backfilling = $result[0][2]

Write-Host "Index Name: $indexName" -ForegroundColor White
if ($indexStatus -eq "ACTIVE") {
    Write-Host "Status: $indexStatus [ACTIVE]" -ForegroundColor Green
    Write-Host ""
    Write-Host "SUCCESS! EmployerIndex is ACTIVE! You can now refresh your app." -ForegroundColor Green
    Write-Host "The Quick Jobs page should display data from DynamoDB." -ForegroundColor Green
} elseif ($indexStatus -eq "CREATING") {
    Write-Host "Status: $indexStatus [CREATING]" -ForegroundColor Yellow
    Write-Host "Backfilling: $backfilling" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Index is still being created. Please wait..." -ForegroundColor Yellow
    Write-Host "This usually takes 5-10 minutes for small tables." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Run this script again in a few minutes to check status." -ForegroundColor Cyan
} else {
    Write-Host "Status: $indexStatus [UNKNOWN]" -ForegroundColor Red
}

Write-Host ""
Write-Host "Table info:" -ForegroundColor Cyan
$count = aws dynamodb scan --table-name PostQuickJob --region ap-southeast-1 --select COUNT | ConvertFrom-Json
Write-Host "Total jobs in table: $($count.Count)" -ForegroundColor White
