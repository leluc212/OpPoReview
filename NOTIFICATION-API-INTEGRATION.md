# Notification API Integration - Completed ✅

## Tóm tắt
Đã tích hợp thành công Notifications API backend với frontend application. Hệ thống notifications giờ đây sử dụng API thay vì localStorage.

## API Endpoint
```
VITE_NOTIFICATIONS_API=https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com
```

## Các thay đổi đã thực hiện

### 1. **notificationService.js** - Chuyển từ localStorage sang API
- ✅ `getAllNotifications()` - Gọi GET `/notifications`
- ✅ `getNotifications(userId, role)` - Gọi GET `/notifications?recipientId={userId}&recipientRole={role}`
- ✅ `getUnreadCount(userId, role)` - Tính từ kết quả API
- ✅ `createPackagePurchaseRequestNotification()` - POST notification khi employer mua gói
- ✅ `createPackageApprovedNotification()` - POST notification khi admin duyệt gói
- ✅ `markAsRead(notificationId)` - PUT `/notifications/{id}`
- ✅ `markAllAsRead(userId, role)` - PUT `/notifications/mark-all-read`
- ✅ `deleteNotification(notificationId)` - DELETE `/notifications/{id}`
- ✅ `clearAllNotifications(userId, role)` - DELETE `/notifications/clear-all`

### 2. **PackagesManagement.jsx** - Admin duyệt gói
- ✅ Cập nhật `handleApprove()` để sử dụng `await` khi tạo notification
- ✅ Gửi notification cho employer khi admin duyệt gói

### 3. **Subscription.jsx** - Employer mua gói
- ✅ Cập nhật để sử dụng `await` khi tạo notification
- ✅ Gửi notification cho admin khi employer yêu cầu mua gói

### 4. **NotificationBell.jsx** - Component hiển thị notifications
- ✅ Cập nhật `loadNotifications()` thành async function
- ✅ Cập nhật `handleNotificationClick()` thành async
- ✅ Cập nhật `handleMarkAllAsRead()` thành async
- ✅ Xóa storage event listener (không cần thiết với API)

### 5. **Navbar.jsx** - Navigation bar với notification bell
- ✅ Cập nhật `loadNotifications()` thành async function
- ✅ Xóa storage event listener (không cần thiết với API)

## Luồng hoạt động

### Khi Employer mua gói:
1. Employer chọn gói và xác nhận mua
2. Frontend gọi API tạo subscription
3. Frontend gọi `createPackagePurchaseRequestNotification()` 
4. Notification được POST đến API backend
5. Admin nhận được notification real-time (polling mỗi 10s)

### Khi Admin duyệt gói:
1. Admin click nút "Duyệt" trên gói pending
2. Frontend cập nhật subscription status = 'active'
3. Frontend gọi `createPackageApprovedNotification()`
4. Notification được POST đến API backend
5. Employer nhận được notification real-time (polling mỗi 10s)

## API Endpoints được sử dụng

### GET `/notifications`
Lấy tất cả notifications

### GET `/notifications?recipientId={userId}&recipientRole={role}`
Lấy notifications cho user cụ thể

### POST `/notifications`
Tạo notification mới
```json
{
  "type": "package_purchase_request",
  "title": "Yêu cầu mua gói dịch vụ mới",
  "titleEn": "New Package Purchase Request",
  "message": "...",
  "messageEn": "...",
  "recipientId": "admin",
  "recipientRole": "admin",
  "senderId": "employer123",
  "senderName": "Company Name",
  "data": { ... },
  "icon": "package",
  "color": "#3b82f6",
  "actionUrl": "/admin/packages",
  "actionText": "Xem chi tiết",
  "actionTextEn": "View Details"
}
```

### PUT `/notifications/{id}`
Đánh dấu notification đã đọc
```json
{
  "read": true
}
```

### PUT `/notifications/mark-all-read`
Đánh dấu tất cả đã đọc
```json
{
  "recipientId": "user123",
  "recipientRole": "admin"
}
```

### DELETE `/notifications/{id}`
Xóa notification

### DELETE `/notifications/clear-all`
Xóa tất cả notifications của user
```json
{
  "recipientId": "user123",
  "recipientRole": "admin"
}
```

## Testing

### Test 1: Employer mua gói
1. Login as Employer
2. Vào trang Subscription
3. Chọn gói và mua
4. Kiểm tra console log: "✅ Notification sent to admin successfully"
5. Login as Admin
6. Kiểm tra notification bell có badge số mới
7. Click bell để xem notification

### Test 2: Admin duyệt gói
1. Login as Admin
2. Vào trang Packages Management
3. Tab "Chờ duyệt"
4. Click nút "Duyệt" trên gói pending
5. Kiểm tra console log: "✅ Notification sent to employer successfully"
6. Login as Employer
7. Kiểm tra notification bell có badge số mới
8. Click bell để xem notification

## Troubleshooting

### Không thấy notifications
1. Kiểm tra `.env` có `VITE_NOTIFICATIONS_API` đúng không
2. Restart dev server sau khi thêm env variable
3. Kiểm tra console log có lỗi API không
4. Kiểm tra Network tab trong DevTools

### Notifications không real-time
- Hệ thống sử dụng polling mỗi 10 giây
- Không phải WebSocket real-time
- Có thể giảm interval xuống 5s nếu cần

### CORS errors
- Đảm bảo API Gateway đã enable CORS
- Kiểm tra API response headers có `Access-Control-Allow-Origin: *`

## Next Steps (Optional)
- [ ] Thêm WebSocket cho real-time notifications
- [ ] Thêm push notifications
- [ ] Thêm email notifications
- [ ] Thêm notification preferences/settings
- [ ] Thêm notification categories/filters
