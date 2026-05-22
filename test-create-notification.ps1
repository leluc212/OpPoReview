# Test script to create a notification via API
$API_ENDPOINT = "https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com"

$notificationData = @{
    type = "package_purchase_request"
    title = "Test - Yêu cầu mua gói dịch vụ"
    titleEn = "Test - Package Purchase Request"
    message = "Test Company yêu cầu mua gói Quick Boost (24h) - Giá: 29,000 VND"
    messageEn = "Test Company requested Quick Boost package (24h) - Price: 29,000 VND"
    recipientId = "admin"
    recipientRole = "admin"
    senderId = "test-employer-123"
    senderName = "Test Company"
    data = @{
        subscriptionId = "SUB-TEST-123"
        packageName = "Quick Boost"
        duration = "24h"
        price = 29000
        employerId = "test-employer-123"
        companyName = "Test Company"
    }
    icon = "package"
    color = "#3b82f6"
    actionUrl = "/admin/packages"
    actionText = "Xem chi tiết"
    actionTextEn = "View Details"
} | ConvertTo-Json -Depth 10

Write-Host "Sending notification to API..." -ForegroundColor Yellow
Write-Host "API Endpoint: $API_ENDPOINT/notifications" -ForegroundColor Cyan
Write-Host ""
Write-Host "Request Body:" -ForegroundColor Cyan
Write-Host $notificationData -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$API_ENDPOINT/notifications" `
        -Method POST `
        -ContentType "application/json; charset=utf-8" `
        -Body $notificationData
    
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor Gray
    
} catch {
    Write-Host "ERROR!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error Message:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Gray
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Red
    Write-Host $_.ErrorDetails.Message -ForegroundColor Gray
}
