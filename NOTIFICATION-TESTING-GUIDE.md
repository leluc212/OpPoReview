# Hướng Dẫn Test Hệ Thống Notifications ✅

## ✅ API đã được fix và hoạt động!

### Vấn đề đã fix:
1. ✅ Lambda function thiếu IAM policy cho DynamoDB - **ĐÃ FIX**
2. ✅ Lambda function thiếu permission cho API Gateway invoke - **ĐÃ FIX**
3. ✅ Service code đã được cập nhật để sử dụng API - **ĐÃ FIX**

### API Endpoint:
```
https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com
```

---

## 🧪 Test Scenarios

### Test 1: Employer mua gói → Admin nhận notification

#### Bước 1: Login as Employer
1. Mở browser: `http://localhost:3000`
2. Login với tài khoản Employer
3. Vào trang **Subscription** (Gói dịch vụ)

#### Bước 2: Mua gói
1. Chọn một gói (ví dụ: Quick Boost)
2. Chọn thời hạn (24h, 7 ngày, 1 tháng)
3. Click **"Chọn Gói"**
4. Xác nhận mua

#### Bước 3: Kiểm tra Console
Mở DevTools Console (F12), bạn sẽ thấy:
```
✅ Notification sent to admin successfully
```

#### Bước 4: Login as Admin
1. Logout khỏi Employer account
2. Login với tài khoản Admin
3. Kiểm tra **notification bell** (icon chuông) ở góc phải navbar
4. Bạn sẽ thấy **badge đỏ** với số thông báo mới

#### Bước 5: Xem notification
1. Click vào notification bell
2. Dropdown sẽ hiện ra với notification:
   - **Title**: "Yêu cầu mua gói dịch vụ mới"
   - **Message**: "[Tên công ty] yêu cầu mua gói [Tên gói] ([Thời hạn])"
   - **Icon**: Package icon màu xanh
3. Click vào notification → Chuyển đến trang **Packages Management**

---

### Test 2: Admin duyệt gói → Employer nhận notification

#### Bước 1: Login as Admin
1. Vào trang **Packages Management**
2. Click tab **"Chờ duyệt"**
3. Bạn sẽ thấy danh sách các gói đang chờ duyệt

#### Bước 2: Duyệt gói
1. Click nút **"Duyệt"** (màu xanh lá) trên gói cần duyệt
2. Kiểm tra Console, bạn sẽ thấy:
```
✅ Notification sent to employer successfully
```
3. Gói sẽ chuyển sang tab **"Đã duyệt"**

#### Bước 3: Login as Employer
1. Logout khỏi Admin account
2. Login lại với tài khoản Employer
3. Kiểm tra **notification bell**
4. Bạn sẽ thấy **badge đỏ** với số thông báo mới

#### Bước 4: Xem notification
1. Click vào notification bell
2. Dropdown sẽ hiện ra với notification:
   - **Title**: "Gói dịch vụ đã được kích hoạt"
   - **Message**: "Gói [Tên gói] ([Thời hạn]) của bạn đã được admin phê duyệt và kích hoạt thành công!"
   - **Icon**: Check circle màu xanh lá
3. Click vào notification → Chuyển đến trang **My Packages**

---

## 🔍 Kiểm tra API trực tiếp

### Test GET notifications
```bash
curl -X GET "https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com/notifications?recipientId=admin&recipientRole=admin"
```

### Test POST notification
```bash
curl -X POST "https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com/notifications" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "test",
    "title": "Test",
    "titleEn": "Test",
    "message": "Test message",
    "messageEn": "Test message",
    "recipientId": "admin",
    "recipientRole": "admin",
    "senderId": "test",
    "senderName": "Test",
    "data": {},
    "icon": "bell",
    "color": "#3b82f6",
    "actionUrl": "/",
    "actionText": "View",
    "actionTextEn": "View"
  }'
```

---

## 🎯 Các tính năng đã hoạt động

### ✅ Tạo notification
- Employer mua gói → Tạo notification cho Admin
- Admin duyệt gói → Tạo notification cho Employer

### ✅ Hiển thị notifications
- Notification bell với badge số lượng chưa đọc
- Dropdown hiển thị danh sách notifications
- Icon và màu sắc theo loại notification
- Thời gian hiển thị (vừa xong, X phút trước, X giờ trước...)

### ✅ Đánh dấu đã đọc
- Click vào notification → Tự động đánh dấu đã đọc
- Button "Đánh dấu tất cả đã đọc"

### ✅ Real-time updates
- Polling mỗi 10 giây để lấy notifications mới
- Badge tự động cập nhật khi có notification mới

### ✅ Navigation
- Click notification → Chuyển đến trang liên quan
- Admin: Chuyển đến Packages Management
- Employer: Chuyển đến My Packages

---

## 🐛 Troubleshooting

### Không thấy notifications?

1. **Kiểm tra .env file**
   ```
   VITE_NOTIFICATIONS_API=https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com
   ```

2. **Restart dev server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Clear browser cache**
   - Mở DevTools (F12)
   - Right-click Refresh button → "Empty Cache and Hard Reload"

4. **Kiểm tra Console logs**
   - Mở DevTools Console (F12)
   - Tìm lỗi màu đỏ
   - Kiểm tra Network tab để xem API calls

### CORS errors?
- API đã được cấu hình CORS đúng
- Nếu vẫn gặp lỗi, kiểm tra browser console

### Notifications không real-time?
- Hệ thống sử dụng polling mỗi 10 giây
- Không phải WebSocket real-time
- Refresh trang để thấy ngay lập tức

---

## 📊 Database Structure

### DynamoDB Table: Notifications

**Primary Key:**
- `notificationId` (String) - Partition Key

**Attributes:**
- `type` - Loại notification (package_purchase_request, package_approved)
- `title` / `titleEn` - Tiêu đề (VI/EN)
- `message` / `messageEn` - Nội dung (VI/EN)
- `recipientId` - ID người nhận
- `recipientRole` - Role người nhận (admin, employer)
- `senderId` - ID người gửi
- `senderName` - Tên người gửi
- `data` - Dữ liệu bổ sung (JSON)
- `read` - Đã đọc chưa (Boolean)
- `deleted` - Đã xóa chưa (Boolean)
- `createdAt` - Thời gian tạo (ISO string)
- `updatedAt` - Thời gian cập nhật (ISO string)
- `icon` - Icon type (package, check-circle, bell)
- `color` - Màu sắc (hex code)
- `actionUrl` - URL khi click
- `actionText` / `actionTextEn` - Text button action (VI/EN)

---

## 🚀 Next Steps (Optional)

- [ ] Thêm WebSocket cho real-time notifications
- [ ] Thêm email notifications
- [ ] Thêm push notifications (PWA)
- [ ] Thêm notification preferences/settings
- [ ] Thêm notification history page
- [ ] Thêm notification categories/filters
- [ ] Thêm notification sound effects

---

## ✅ Summary

**Hệ thống notifications đã hoàn toàn hoạt động!**

1. ✅ API Gateway + Lambda + DynamoDB
2. ✅ CORS configured
3. ✅ IAM permissions configured
4. ✅ Frontend integrated
5. ✅ Real-time polling (10s)
6. ✅ Employer → Admin notifications
7. ✅ Admin → Employer notifications
8. ✅ Mark as read functionality
9. ✅ Navigation to related pages
10. ✅ Bilingual support (VI/EN)

**Bây giờ bạn có thể test ngay! 🎉**
