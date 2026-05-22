# Script to create a test notification via API

$API_ENDPOINT = "https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com"

$notification = @{
    type = "package_purchase_request"
    title = "Yêu cầu mua gói dịch vụ mới"
    titleEn = "New Package Purchase Request"
    message = "Công ty Test yêu cầu mua gói Quick Boost (24h)"
    messageEn = "Test Company requested to purchase Quick Boost package (24h)"
    recipientId = "admin"
    recipientRole = "admin"
    senderId = "test-employer-123"
    senderName = "Công ty Test"
    data = @{
        subscriptionId = "SUB-TEST-$(Get-Date -Format 'yyyyMMddHHmmss')"
        packageName = "Quick Boost"
        duration = "24h"
        price = 29000
    }
    icon = "package"
    color = "#3b82f6"
    actionUrl = "/admin/packages"
    actionText = "Xem chi tiết"
    actionTextEn = "View Details"
} | ConvertTo-Json -Depth 10

Write-Host "Creating test notification..." -ForegroundColor Yellow
Write-Host "Payload:" -ForegroundColor Cyan
Write-Host $notification

try {
    $response = Invoke-RestMethod -Uri "$API_ENDPOINT/notifications" `
        -Method Post `
        -ContentType "application/json; charset=utf-8" `
        -Body $notification
    
    Write-Host "`n✅ Success!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10 | Write-Host
    
    Write-Host "`nNow refresh your Admin Dashboard to see the notification!" -ForegroundColor Yellow
} catch {
    Write-Host "`n❌ Error!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host $_.Exception.Response -ForegroundColor Red
}
