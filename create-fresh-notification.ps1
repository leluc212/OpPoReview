# Create a fresh notification with CURRENT timestamp to prove RelativeTime works

$API_ENDPOINT = "https://rvvvqxqhq3.execute-api.ap-southeast-1.amazonaws.com/prod"

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Tạo Notification MỚI với Timestamp HIỆN TẠI" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Prompt for employer ID
$employerId = Read-Host "Nhập Employer ID của bạn (hoặc nhấn Enter để dùng test ID)"
if ([string]::IsNullOrWhiteSpace($employerId)) {
    $employerId = "test-employer-001"
    Write-Host "Sử dụng test ID: $employerId" -ForegroundColor Yellow
}

# Get CURRENT timestamp
$currentTime = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")

Write-Host ""
Write-Host "⏰ Timestamp HIỆN TẠI: $currentTime" -ForegroundColor Green
Write-Host "   (Notification này sẽ hiển thị 'Vừa xong' hoặc 'X giây trước')" -ForegroundColor Green
Write-Host ""

# Create notification with CURRENT timestamp
$notification = @{
    type = "package_approved"
    title = "🎉 TEST - Notification MỚI"
    titleEn = "🎉 TEST - NEW Notification"
    message = "Đây là notification test với timestamp HIỆN TẠI để chứng minh RelativeTime component hoạt động đúng!"
    messageEn = "This is a test notification with CURRENT timestamp to prove RelativeTime component works correctly!"
    recipientId = $employerId
    recipientRole = "employer"
    senderId = "admin"
    senderName = "Admin Test"
    data = @{
        subscriptionId = "test-sub-$(Get-Random -Maximum 9999)"
        packageName = "Test Package"
        duration = "24h"
        testNote = "Created at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    }
    icon = "check-circle"
    color = "#10b981"
    actionUrl = "/employer/subscription"
    actionText = "Xem chi tiết"
    actionTextEn = "View details"
    createdAt = $currentTime
} | ConvertTo-Json -Depth 10

Write-Host "📤 Đang gửi notification..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "$API_ENDPOINT/notifications" `
        -Method Post `
        -ContentType "application/json; charset=utf-8" `
        -Body $notification
    
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "  ✅ THÀNH CÔNG!" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "Notification ID: $($response.data.notificationId)" -ForegroundColor Green
    Write-Host "Created at: $($response.data.createdAt)" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔄 Bây giờ:" -ForegroundColor Yellow
    Write-Host "   1. Mở trang notifications: http://localhost:3000/OpPoReview/employer/notifications" -ForegroundColor White
    Write-Host "   2. Bạn sẽ thấy notification MỚI này hiển thị:" -ForegroundColor White
    Write-Host "      - 'Vừa xong' (nếu < 10 giây)" -ForegroundColor Cyan
    Write-Host "      - 'X giây trước' (nếu < 1 phút)" -ForegroundColor Cyan
    Write-Host "      - 'X phút trước' (nếu < 1 giờ)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 Điều này chứng minh RelativeTime component:" -ForegroundColor Yellow
    Write-Host "   ✅ KHÔNG sử dụng hardcoded text" -ForegroundColor Green
    Write-Host "   ✅ Tính toán thời gian ĐỘNG từ timestamp" -ForegroundColor Green
    Write-Host "   ✅ Tự động cập nhật theo thời gian thực" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 Notification cũ hiển thị '7 giờ trước' vì chúng" -ForegroundColor Yellow
    Write-Host "   THỰC SỰ được tạo 7 giờ trước trong database!" -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host "  ❌ LỖI" -ForegroundColor Red
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host ""
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "💡 Kiểm tra:" -ForegroundColor Yellow
    Write-Host "   - API endpoint có đúng không?" -ForegroundColor White
    Write-Host "   - Employer ID có tồn tại không?" -ForegroundColor White
    Write-Host "   - Internet connection có ổn định không?" -ForegroundColor White
}

Write-Host ""
Write-Host "Nhấn Enter để đóng..." -ForegroundColor Gray
Read-Host
