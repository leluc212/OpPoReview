# Clear Employer Profile Data from DynamoDB
# This script removes all test data from EmployerProfiles table

Write-Host "🗑️  Clearing Employer Profile Data" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Yellow
Write-Host ""

$tableName = "EmployerProfiles"
$region = "ap-southeast-1"

# Warning
Write-Host "⚠️  WARNING: This will delete ALL data from the EmployerProfiles table!" -ForegroundColor Red
Write-Host ""
$confirm = Read-Host "Are you sure you want to continue? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "❌ Operation cancelled" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "📋 Scanning table for items..." -ForegroundColor Cyan

try {
    # Scan the table to get all items
    $scanResult = aws dynamodb scan `
        --table-name $tableName `
        --region $region 2>&1 | ConvertFrom-Json
    
    if ($scanResult.Items -and $scanResult.Items.Count -gt 0) {
        Write-Host "✅ Found $($scanResult.Items.Count) item(s)" -ForegroundColor Green
        Write-Host ""
        
        $deletedCount = 0
        foreach ($item in $scanResult.Items) {
            $userId = $item.userId.S
            Write-Host "🗑️  Deleting item with userId: $userId" -ForegroundColor Cyan
            
            try {
                aws dynamodb delete-item `
                    --table-name $tableName `
                    --key "{`"userId`": {`"S`": `"$userId`"}}" `
                    --region $region 2>&1 | Out-Null
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "   ✅ Deleted" -ForegroundColor Green
                    $deletedCount++
                } else {
                    Write-Host "   ❌ Failed to delete" -ForegroundColor Red
                }
            } catch {
                Write-Host "   ❌ Error: $_" -ForegroundColor Red
            }
        }
        
        Write-Host ""
        Write-Host "📊 Summary:" -ForegroundColor Cyan
        Write-Host "   Total items found: $($scanResult.Items.Count)" -ForegroundColor Cyan
        Write-Host "   Successfully deleted: $deletedCount" -ForegroundColor Green
        
    } else {
        Write-Host "ℹ️  Table is already empty" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Error scanning table: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Done! The EmployerProfiles table is now empty." -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Refresh the application" -ForegroundColor Cyan
Write-Host "2. The profile page should show empty fields" -ForegroundColor Cyan
Write-Host "3. Fill in new company information" -ForegroundColor Cyan
Write-Host "4. Click Save to test the API" -ForegroundColor Cyan
Write-Host ""
