# Test POST notification API
$apiUrl = "https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com/notifications"

$body = @{
    type = "package_purchase_request"
    title = "Test Notification from PowerShell"
    titleEn = "Test Notification from PowerShell"
    message = "Test Company yêu cầu mua gói Quick Boost (24h) - Giá: 29,000 VND"
    messageEn = "Test Company requested Quick Boost package (24h) - Price: 29,000 VND"
    recipientId = "admin"
    recipientRole = "admin"
    senderId = "test-employer-ps"
    senderName = "Test Company PS"
    data = @{
        subscriptionId = "SUB-TEST-PS-123"
        packageName = "Quick Boost"
        duration = "24h"
        price = 29000
        employerId = "test-employer-ps"
        companyName = "Test Company PS"
    }
    icon = "package"
    color = "#3b82f6"
    actionUrl = "/admin/packages"
    actionText = "Xem chi tiết"
    actionTextEn = "View Details"
} | ConvertTo-Json -Depth 10

Write-Host "Sending POST request to: $apiUrl"
Write-Host "Body: $body"

try {
    $response = Invoke-WebRequest -Uri $apiUrl -Method POST -Body $body -ContentType "application/json; charset=utf-8" -UseBasicParsing
    Write-Host "✅ Success! Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response)"
}
