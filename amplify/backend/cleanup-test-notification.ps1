# Cleanup test notification from DynamoDB

Write-Host "Cleaning up test notification..." -ForegroundColor Yellow

$notificationId = "NOTIF-20260521-f2396888"

aws dynamodb delete-item `
    --table-name Notifications `
    --key "{\"notificationId\": {\"S\": \"$notificationId\"}}" `
    --region ap-southeast-1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Test notification deleted" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to delete test notification" -ForegroundColor Red
}
