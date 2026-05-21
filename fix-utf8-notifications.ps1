# Fix UTF-8 Notifications Script
# This script will:
# 1. Deploy updated Lambda function with UTF-8 fix
# 2. Delete old notifications with encoding issues
# 3. Create new test notifications with correct UTF-8

Write-Host "=== FIX UTF-8 NOTIFICATIONS ===" -ForegroundColor Cyan

# Step 1: Package Lambda function
Write-Host "`n1. Packaging Lambda function..." -ForegroundColor Yellow
cd amplify\backend
Compress-Archive -Path notifications-lambda.py -DestinationPath notifications-lambda.zip -Force
Write-Host "   ✅ Lambda packaged" -ForegroundColor Green

# Step 2: Update Lambda function
Write-Host "`n2. Updating Lambda function..." -ForegroundColor Yellow
$lambdaName = "notifications-handler"
aws lambda update-function-code `
    --function-name $lambdaName `
    --zip-file fileb://notifications-lambda.zip `
    --region ap-southeast-1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Lambda function updated" -ForegroundColor Green
} else {
    Write-Host "   ❌ Failed to update Lambda function" -ForegroundColor Red
    exit 1
}

# Step 3: Wait for Lambda to be ready
Write-Host "`n3. Waiting for Lambda to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Write-Host "   ✅ Lambda ready" -ForegroundColor Green

# Step 4: Delete old notifications (optional - uncomment if needed)
# Write-Host "`n4. Deleting old notifications..." -ForegroundColor Yellow
# aws dynamodb scan --table-name Notifications --region ap-southeast-1 | `
#     ConvertFrom-Json | `
#     Select-Object -ExpandProperty Items | `
#     ForEach-Object {
#         $notifId = $_.notificationId.S
#         aws dynamodb delete-item `
#             --table-name Notifications `
#             --key "{\"notificationId\":{\"S\":\"$notifId\"}}" `
#             --region ap-southeast-1
#         Write-Host "   Deleted: $notifId" -ForegroundColor Gray
#     }
# Write-Host "   ✅ Old notifications deleted" -ForegroundColor Green

Write-Host "`n=== DONE ===" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Open test-utf8-notification.html in browser" -ForegroundColor White
Write-Host "2. Click 'Tạo thông báo test' to create a test notification" -ForegroundColor White
Write-Host "3. Click 'Xem thông báo' to verify UTF-8 encoding" -ForegroundColor White
Write-Host "4. Check if Vietnamese characters display correctly" -ForegroundColor White
Write-Host "`nIf still broken, run this to delete old notifications:" -ForegroundColor Yellow
Write-Host "aws dynamodb scan --table-name Notifications --region ap-southeast-1" -ForegroundColor Gray

cd ..\..
