# Wait for EmployerIndex to be ACTIVE

Write-Host "⏳ Waiting for EmployerIndex to be ACTIVE..." -ForegroundColor Cyan
Write-Host ""

$maxAttempts = 60  # 60 attempts x 10 seconds = 10 minutes max
$attempt = 0

while ($attempt -lt $maxAttempts) {
    $attempt++
    
    Write-Host "[$attempt/$maxAttempts] Checking index status..." -ForegroundColor Yellow
    
    $result = aws dynamodb describe-table `
        --table-name PostQuickJob `
        --region ap-southeast-1 `
        --query 'Table.GlobalSecondaryIndexes[?IndexName==`EmployerIndex`].IndexStatus' `
        --output text
    
    if ($result -eq "ACTIVE") {
        Write-Host ""
        Write-Host "✅ EmployerIndex is now ACTIVE!" -ForegroundColor Green
        Write-Host ""
        
        # Show all indexes
        Write-Host "📋 All indexes:" -ForegroundColor Cyan
        aws dynamodb describe-table `
            --table-name PostQuickJob `
            --region ap-southeast-1 `
            --query 'Table.GlobalSecondaryIndexes[*].[IndexName,IndexStatus]' `
            --output table
        
        Write-Host ""
        Write-Host "🎉 You can now refresh your app and see Quick Jobs data!" -ForegroundColor Green
        Write-Host ""
        exit 0
    }
    
    Write-Host "   Status: $result - waiting 10 seconds..." -ForegroundColor Gray
    Start-Sleep -Seconds 10
}

Write-Host ""
Write-Host "⚠️ Timeout waiting for index. Please check manually:" -ForegroundColor Yellow
Write-Host "   aws dynamodb describe-table --table-name PostQuickJob --region ap-southeast-1" -ForegroundColor White
