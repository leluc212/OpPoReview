# Test Notification API
$API = "https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com"

Write-Host "`nTesting Notification API..." -ForegroundColor Cyan

# Create notification
$body = @{
    type = "package_purchase_request"
    title = "Test"
    message = "Test message"
    recipientId = "admin"
    recipientRole = "admin"
    senderId = "test"
    senderName = "Test"
} | ConvertTo-Json

Write-Host "`n[1] Creating notification..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API/notifications" -Method POST -Body $body -ContentType "application/json"
    if ($response.success) {
        Write-Host "SUCCESS: $($response.data.notificationId)" -ForegroundColor Green
    }
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Get notifications
Write-Host "`n[2] Getting notifications..." -ForegroundColor Yellow
try {
    $notifs = Invoke-RestMethod -Uri "$API/notifications?recipientId=admin&recipientRole=admin"
    Write-Host "Found: $($notifs.Count) notifications" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Check DynamoDB
Write-Host "`n[3] Checking DynamoDB..." -ForegroundColor Yellow
$result = aws dynamodb scan --table-name Notifications --region ap-southeast-1 --max-items 1 2>&1 | Out-String
if ($result -match '"Count":\s*(\d+)') {
    Write-Host "DynamoDB has: $($matches[1]) items" -ForegroundColor Green
} else {
    Write-Host "Could not check DynamoDB" -ForegroundColor Yellow
}

Write-Host ""
