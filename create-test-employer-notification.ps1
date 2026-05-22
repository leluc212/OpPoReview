# Script to create a test notification for employer with current timestamp

$API_ENDPOINT = "https://rvvvqxqhq3.execute-api.ap-southeast-1.amazonaws.com/prod"

# Get current timestamp in ISO format
$currentTime = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")

Write-Host "Creating test notification with timestamp: $currentTime" -ForegroundColor Cyan

# Create notification payload
$notification = @{
    type = "package_approved"
    title = "Gói dịch vụ đã được kích hoạt (TEST)"
    titleEn = "Package Activated (TEST)"
    message = "Gói Hot Search (24h) của bạn đã được admin phê duyệt và kích hoạt thành công! — TEST NOTIFICATION"
    messageEn = "Your Hot Search (24h) package has been approved and activated! — TEST NOTIFICATION"
    recipientId = "YOUR_EMPLOYER_ID_HERE"  # Replace with actual employer ID
    recipientRole = "employer"
    senderId = "admin"
    senderName = "Admin"
    data = @{
        subscriptionId = "test-sub-001"
        packageName = "Hot Search"
        duration = "24h"
        expiryDate = (Get-Date).AddDays(1).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    }
    icon = "check-circle"
    color = "#10b981"
    actionUrl = "/employer/subscription"
    actionText = "Xem gói của tôi"
    actionTextEn = "View My Packages"
    createdAt = $currentTime
} | ConvertTo-Json -Depth 10

Write-Host "`nNotification payload:" -ForegroundColor Yellow
Write-Host $notification

# Send to API
try {
    $response = Invoke-RestMethod -Uri "$API_ENDPOINT/notifications" `
        -Method Post `
        -ContentType "application/json; charset=utf-8" `
        -Body $notification
    
    Write-Host "`n✅ Notification created successfully!" -ForegroundColor Green
    Write-Host "Notification ID: $($response.data.notificationId)" -ForegroundColor Green
    Write-Host "Created at: $($response.data.createdAt)" -ForegroundColor Green
    Write-Host "`nCheck your employer notifications page to see the new notification!" -ForegroundColor Cyan
} catch {
    Write-Host "`n❌ Error creating notification:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
}
