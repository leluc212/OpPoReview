# Delete Old Notifications Script
Write-Host "=== DELETE OLD NOTIFICATIONS ===" -ForegroundColor Cyan

Write-Host "`nScanning Notifications table..." -ForegroundColor Yellow
$scanResult = aws dynamodb scan --table-name Notifications --region ap-southeast-1 | ConvertFrom-Json

$items = $scanResult.Items
$count = $items.Count

Write-Host "Found $count notifications" -ForegroundColor White

if ($count -eq 0) {
    Write-Host "No notifications to delete" -ForegroundColor Green
    exit 0
}

Write-Host "`nDeleting notifications..." -ForegroundColor Yellow
$deleted = 0

foreach ($item in $items) {
    $notifId = $item.notificationId.S
    
    try {
        aws dynamodb delete-item `
            --table-name Notifications `
            --key "{\"notificationId\":{\"S\":\"$notifId\"}}" `
            --region ap-southeast-1 | Out-Null
        
        $deleted++
        Write-Host "  ✅ Deleted: $notifId" -ForegroundColor Gray
    } catch {
        Write-Host "  ❌ Failed to delete: $notifId" -ForegroundColor Red
    }
}

Write-Host "`n=== DONE ===" -ForegroundColor Cyan
Write-Host "Deleted $deleted out of $count notifications" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Employer mua gói mới → Tạo notification với UTF-8 đúng" -ForegroundColor White
Write-Host "2. Admin duyệt gói → Tạo notification với UTF-8 đúng" -ForegroundColor White
Write-Host "3. Kiểm tra Navbar bell → Xem notifications hiển thị đúng" -ForegroundColor White
