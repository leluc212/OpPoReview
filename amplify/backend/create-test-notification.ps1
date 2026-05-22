# Create test notification for Admin

Write-Host "Creating test notification for Admin..." -ForegroundColor Yellow

$notification = @{
    type = "package_purchase_request"
    title = "Yêu cầu mua gói dịch vụ mới"
    titleEn = "New Package Purchase Request"
    message = "Công ty cà phê Katinat yêu cầu mua gói Quick Boost (24h)"
    messageEn = "Katinat Coffee Company requested to purchase Quick Boost package (24h)"
    recipientId = "admin"
    recipientRole = "admin"
    senderId = "test-employer-123"
    senderName = "Công ty cà phê Katinat"
    data = @{
        subscriptionId = "SUB-TEST-001"
        packageName = "Quick Boost"
        duration = "24h"
        price = 29000
    }
    icon = "package"
    color = "#3b82f6"
    actionUrl = "/admin/packages"
    actionText = "Xem chi tiết"
    actionTextEn = "View Details"
} | ConvertTo-Json -Depth 5

Write-Host "Notification payload:" -ForegroundColor Cyan
Write-Host $notification -ForegroundColor Gray

$response = Invoke-RestMethod `
    -Uri "https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com/notifications" `
    -Method Post `
    -ContentType "application/json" `
    -Body $notification

Write-Host ""
Write-Host "✓ Notification created successfully!" -ForegroundColor Green
Write-Host "Notification ID: $($response.data.notificationId)" -ForegroundColor White
Write-Host ""
Write-Host "Now open Admin dashboard to see the notification!" -ForegroundColor Yellow
