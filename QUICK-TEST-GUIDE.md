# 🚀 Quick Test Guide - Notification System

## ⚡ Test Nhanh (5 phút)

### Bước 1: Mở Test Page
```powershell
start d:\OpPoReviewWeb\test-notification-system.html
```

### Bước 2: Tạo Notification Test
1. Click nút **"🚀 Tạo Thông Báo Test"**
2. Xem console logs màu xanh: ✅ Thông báo đã được tạo thành công!

### Bước 3: Xem Notifications
1. Click nút **"📋 Xem Thông Báo Admin"**
2. Xem danh sách notifications trong console logs

### Bước 4: Verify UTF-8
- Kiểm tra tiếng Việt hiển thị đúng trong logs
- Không có ký tự lỗi như: �, \u, hoặc ???

## ✅ Expected Results

### Console Logs sẽ hiển thị:
```
[10:30:00] 🚀 Bắt đầu tạo thông báo test...
[10:30:00] 📦 Notification data: {...}
[10:30:00] 🌐 Sending to: https://iuo7ofruu6...
[10:30:01] 📡 Response status: 201 Created
[10:30:01] ✅ Thông báo đã được tạo thành công!
[10:30:01]    ID: NOTIF-20260521-abc12345
[10:30:01]    Title: Yêu cầu mua gói dịch vụ mới
[10:30:01]    Message: Công ty TNHH Công Nghệ ABC yêu cầu mua gói Hot Search (7 ngày) - Giá: 245,000 VND
[10:30:01]    Recipient: admin (admin)
```

## 🎯 Test trong App

### Test as Employer:
1. Login vào app với tài khoản Employer
2. Vào: `/employer/subscription`
3. Chọn gói "Hot Search - 7 ngày"
4. Click "Mua gói"
5. Mở Console (F12) → Xem logs
6. Tìm: ✅ Notification sent to admin successfully

### Test as Admin:
1. Login vào app với tài khoản Admin
2. Vào: `/admin/notifications`
3. Xem notification mới xuất hiện
4. Kiểm tra:
   - ✅ Tiếng Việt hiển thị đúng
   - ✅ Giá hiển thị đúng: "245,000 VND"
   - ✅ Tên công ty hiển thị đúng
   - ✅ Tên gói hiển thị đúng

## 🔍 Quick Debug

### Không thấy notification?

**Check 1: Browser Console**
```
F12 → Console tab
Tìm: "Creating notification for admin"
```

**Check 2: Network Tab**
```
F12 → Network tab
Tìm: POST /notifications
Status phải là: 201
```

**Check 3: CloudWatch Logs**
```powershell
aws logs tail /aws/lambda/notifications-handler --follow --region ap-southeast-1
```

## 📊 Test Scenarios

### Scenario 1: Single Notification
- Click "🚀 Tạo Thông Báo Test"
- Expected: 1 notification created

### Scenario 2: Multiple Notifications
- Click "📦 Tạo 3 Thông Báo"
- Expected: 3 notifications created (Quick Boost, Hot Search, Spotlight Banner)

### Scenario 3: View All
- Click "📋 Xem Thông Báo Admin"
- Expected: List of all admin notifications

### Scenario 4: Unread Count
- Click "🔢 Đếm Chưa Đọc"
- Expected: Number of unread notifications

## ⚠️ Common Issues

### Issue 1: "Failed to save notification"
**Solution:** Check .env file có VITE_NOTIFICATIONS_API

### Issue 2: Tiếng Việt bị lỗi
**Solution:** Đã fix với UTF-8 encoding

### Issue 3: Notification không xuất hiện
**Solution:** Check recipientId = "admin" và recipientRole = "admin"

## 🎉 Success Indicators

✅ Console logs màu xanh  
✅ Status 201 Created  
✅ Notification ID được tạo  
✅ Tiếng Việt hiển thị đúng  
✅ Giá hiển thị đúng format  
✅ Admin nhận được notification  

## 📞 Need Help?

1. Run test page first
2. Check console logs
3. Check CloudWatch logs
4. Check DynamoDB table
5. Send screenshots

---

**Quick Start:** `start test-notification-system.html` → Click "🚀 Tạo Thông Báo Test"
