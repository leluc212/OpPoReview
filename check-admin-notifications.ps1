# Check admin notifications in database
$apiUrl = "https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com/notifications"

Write-Host "=== Checking Admin Notifications ===" -ForegroundColor Cyan
Write-Host ""

# Get all notifications for admin
Write-Host "📬 Fetching notifications for admin..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$apiUrl`?recipientId=admin`&recipientRole=admin" -Method GET -UseBasicParsing
    $notifications = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ Found $($notifications.Count) notifications for admin" -ForegroundColor Green
    Write-Host ""
    
    if ($notifications.Count -eq 0) {
        Write-Host "⚠️ No notifications found for admin!" -ForegroundColor Yellow
        Write-Host "   This means either:" -ForegroundColor Yellow
        Write-Host "   1. No employer has purchased a package yet" -ForegroundColor Yellow
        Write-Host "   2. The notification API is not being called from frontend" -ForegroundColor Yellow
        Write-Host "   3. Notifications are being created with wrong recipientId/recipientRole" -ForegroundColor Yellow
    } else {
        Write-Host "📋 Notifications:" -ForegroundColor Cyan
        Write-Host ""
        
        $packagePurchaseNotifs = $notifications | Where-Object { $_.type -eq 'package_purchase_request' }
        
        Write-Host "   Package Purchase Requests: $($packagePurchaseNotifs.Count)" -ForegroundColor Magenta
        Write-Host ""
        
        foreach ($notif in $notifications | Select-Object -First 10) {
            Write-Host "   [$($notif.type)]" -ForegroundColor Yellow -NoNewline
            Write-Host " $($notif.title)" -ForegroundColor White
            Write-Host "      ID: $($notif.notificationId)" -ForegroundColor Gray
            Write-Host "      From: $($notif.senderName) ($($notif.senderId))" -ForegroundColor Gray
            Write-Host "      Created: $($notif.createdAt)" -ForegroundColor Gray
            Write-Host "      Read: $($notif.read)" -ForegroundColor Gray
            if ($notif.data.packageName) {
                Write-Host "      Package: $($notif.data.packageName) ($($notif.data.duration)) - $($notif.data.price) VND" -ForegroundColor Cyan
            }
            Write-Host ""
        }
        
        if ($notifications.Count -gt 10) {
            Write-Host "   ... and $($notifications.Count - 10) more" -ForegroundColor Gray
        }
    }
    
} catch {
    Write-Host "❌ Error fetching notifications: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "If you see package_purchase_request notifications above, the API is working!" -ForegroundColor Green
Write-Host "If not, the frontend is not calling the API correctly." -ForegroundColor Yellow
