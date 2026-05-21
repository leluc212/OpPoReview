# Hướng Dẫn Deploy Hệ Thống Thông Báo với DynamoDB

## Tổng Quan

Hệ thống thông báo mới sử dụng:
- **DynamoDB** để lưu trữ notifications
- **Lambda Function** để xử lý API requests
- **API Gateway** để expose REST API
- **Real-time polling** (10 giây) để cập nhật notifications

## Bước 1: Deploy Infrastructure

### 1.1. Chạy PowerShell Script

Mở PowerShell với quyền Administrator và chạy:

```powershell
cd d:\OpPoReviewWeb\amplify\backend
.\create-notifications-lambda.ps1
```

Script sẽ tự động:
- ✅ Tạo DynamoDB table `Notifications`
- ✅ Tạo IAM role và policies
- ✅ Tạo Lambda function `notifications-handler`
- ✅ Tạo API Gateway với các routes
- ✅ Configure CORS

### 1.2. Lấy API Endpoint

Sau khi script chạy xong, bạn sẽ thấy:

```
API Endpoint: https://xxxxxxxxxx.execute-api.ap-southeast-1.amazonaws.com
```

Copy endpoint này.

## Bước 2: Cấu Hình Frontend

### 2.1. Thêm vào .env

Mở file `.env` và thêm:

```env
VITE_NOTIFICATIONS_API=https://xxxxxxxxxx.execute-api.ap-southeast-1.amazonaws.com
```

### 2.2. Restart Dev Server

```bash
npm run dev
```

## Bước 3: Test Hệ Thống

### 3.1. Test API Trực Tiếp

```bash
# Test GET all notifications
curl https://xxxxxxxxxx.execute-api.ap-southeast-1.amazonaws.com/notifications

# Test POST create notification
curl -X POST https://xxxxxxxxxx.execute-api.ap-southeast-1.amazonaws.com/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "test",
    "title": "Test Notification",
    "titleEn": "Test Notification",
    "message": "This is a test",
    "messageEn": "This is a test",
    "recipientId": "admin",
    "recipientRole": "admin",
    "senderId": "system",
    "senderName": "System",
    "data": {},
    "icon": "bell",
    "color": "#3b82f6",
    "actionUrl": "/admin/dashboard"
  }'
```

### 3.2. Test Flow Employer → Admin

1. **Đăng nhập Employer**
2. **Mua gói dịch vụ**
   - Vào `/employer/subscription`
   - Chọn gói và mua
3. **Kiểm tra Console**
   - Xem log: `✅ Notification created for admin:`
4. **Đăng nhập Admin**
5. **Reload trang**
   - Xem log: `🔔 Loading notifications for:`
6. **Click icon chuông** 🔔
   - Xem notification "Yêu cầu mua gói dịch vụ mới"

### 3.3. Test Flow Admin → Employer

1. **Admin duyệt gói**
   - Vào `/admin/packages`
   - Tab "Chờ duyệt"
   - Click "Duyệt"
2. **Kiểm tra Console**
   - Xem log: `✅ Notification created for employer:`
3. **Đăng nhập Employer**
4. **Reload trang**
5. **Click icon chuông** 🔔
   - Xem notification "Gói dịch vụ đã được kích hoạt"

## Bước 4: Kiểm Tra DynamoDB

### 4.1. Xem Dữ Liệu

```bash
# List all notifications
aws dynamodb scan --table-name Notifications --region ap-southeast-1

# Query notifications for admin
aws dynamodb query \
  --table-name Notifications \
  --index-name RecipientIndex \
  --key-condition-expression "recipientId = :uid AND recipientRole = :role" \
  --expression-attribute-values '{":uid":{"S":"admin"},":role":{"S":"admin"}}' \
  --region ap-southeast-1
```

### 4.2. Xem CloudWatch Logs

```bash
# View Lambda logs
aws logs tail /aws/lambda/notifications-handler --follow --region ap-southeast-1
```

## Kiến Trúc Hệ Thống

### DynamoDB Table: Notifications

**Primary Key:**
- `notificationId` (String) - Partition Key

**Global Secondary Index:**
- `RecipientIndex`: 
  - Hash Key: `recipientId`
  - Range Key: `recipientRole`

**Attributes:**
```json
{
  "notificationId": "NOTIF-20260521-abc123",
  "type": "package_purchase_request | package_approved",
  "title": "Tiêu đề tiếng Việt",
  "titleEn": "English Title",
  "message": "Nội dung tiếng Việt",
  "messageEn": "English Message",
  "recipientId": "user-id | admin",
  "recipientRole": "admin | employer | candidate",
  "senderId": "sender-user-id",
  "senderName": "Tên người gửi",
  "data": { ... },
  "read": false,
  "deleted": false,
  "createdAt": "2026-05-21T00:00:00.000Z",
  "updatedAt": "2026-05-21T00:00:00.000Z",
  "icon": "package | check-circle | bell",
  "color": "#3b82f6",
  "actionUrl": "/admin/packages",
  "actionText": "Xem chi tiết",
  "actionTextEn": "View Details"
}
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | Get all notifications |
| GET | `/notifications/user/{userId}?role={role}` | Get notifications for user |
| GET | `/notifications/unread/{userId}?role={role}` | Get unread count |
| GET | `/notifications/{notificationId}` | Get single notification |
| POST | `/notifications` | Create notification |
| PUT | `/notifications/{notificationId}` | Update notification (mark as read) |
| PUT | `/notifications/mark-all-read/{userId}?role={role}` | Mark all as read |
| DELETE | `/notifications/{notificationId}` | Delete notification (soft delete) |

### Frontend Services

**notificationApiService.js:**
- `getNotifications(userId, role)` - Lấy notifications
- `getUnreadCount(userId, role)` - Lấy số lượng chưa đọc
- `createNotification(notification)` - Tạo notification
- `markAsRead(notificationId)` - Đánh dấu đã đọc
- `markAllAsRead(userId, role)` - Đánh dấu tất cả đã đọc
- `deleteNotification(notificationId)` - Xóa notification
- `createPackagePurchaseRequestNotification(subscription)` - Tạo notification khi mua gói
- `createPackageApprovedNotification(subscription, employerId)` - Tạo notification khi duyệt gói

## Real-time Updates

Hệ thống sử dụng **polling** mỗi 10 giây để cập nhật notifications:

```javascript
// Trong Navbar.jsx
useEffect(() => {
  const loadNotifications = async () => {
    const notifs = await getNotifications(userId, role);
    const count = await getUnreadCount(userId, role);
    setRealNotifications(notifs);
    setUnreadCount(count);
  };

  loadNotifications();
  const interval = setInterval(loadNotifications, 10000); // 10 seconds

  return () => clearInterval(interval);
}, [user]);
```

## Ưu Điểm So Với LocalStorage

✅ **Persistent**: Dữ liệu không bị mất khi clear cache
✅ **Cross-device**: Sync giữa các devices
✅ **Scalable**: Có thể lưu unlimited notifications
✅ **Real-time**: Cập nhật tự động mỗi 10 giây
✅ **Queryable**: Có thể query theo user, role, status
✅ **Audit trail**: Có createdAt, updatedAt timestamps

## Troubleshooting

### Lỗi: "Failed to fetch notifications"

**Nguyên nhân:**
- API endpoint chưa được set trong .env
- Lambda function chưa được deploy
- CORS configuration sai

**Giải pháp:**
```bash
# Kiểm tra .env
cat .env | grep VITE_NOTIFICATIONS_API

# Test API
curl https://xxxxxxxxxx.execute-api.ap-southeast-1.amazonaws.com/notifications

# Xem Lambda logs
aws logs tail /aws/lambda/notifications-handler --follow --region ap-southeast-1
```

### Lỗi: "Access Denied"

**Nguyên nhân:**
- IAM role không có quyền truy cập DynamoDB

**Giải pháp:**
```bash
# Kiểm tra IAM role
aws iam get-role --role-name notifications-lambda-role

# Kiểm tra policies
aws iam list-attached-role-policies --role-name notifications-lambda-role
```

### Notifications không hiển thị

**Nguyên nhân:**
- Frontend chưa được restart sau khi thêm .env
- API endpoint sai

**Giải pháp:**
```bash
# Restart dev server
npm run dev

# Kiểm tra console logs
# Mở F12 → Console → Xem logs "🔔 Loading notifications for:"
```

## Update Lambda Code

Nếu cần update Lambda code:

```powershell
cd d:\OpPoReviewWeb\amplify\backend

# Compress code
Compress-Archive -Path notifications-lambda.py -DestinationPath notifications-lambda.zip -Force

# Update Lambda
aws lambda update-function-code `
  --function-name notifications-handler `
  --zip-file fileb://notifications-lambda.zip `
  --region ap-southeast-1
```

## Monitoring

### CloudWatch Metrics

- Lambda invocations
- Lambda errors
- Lambda duration
- DynamoDB read/write capacity

### CloudWatch Logs

```bash
# View logs
aws logs tail /aws/lambda/notifications-handler --follow --region ap-southeast-1

# Filter errors
aws logs filter-log-events \
  --log-group-name /aws/lambda/notifications-handler \
  --filter-pattern "ERROR" \
  --region ap-southeast-1
```

## Cost Estimation

**DynamoDB:**
- Free tier: 25 GB storage, 25 WCU, 25 RCU
- Estimated: $0/month (trong free tier)

**Lambda:**
- Free tier: 1M requests/month, 400,000 GB-seconds
- Estimated: $0/month (trong free tier)

**API Gateway:**
- Free tier: 1M requests/month
- Estimated: $0/month (trong free tier)

**Total: $0/month** (trong free tier)

## Next Steps

1. ✅ Deploy infrastructure
2. ✅ Test notifications
3. 🔄 Implement WebSocket cho real-time updates (optional)
4. 🔄 Add email notifications (optional)
5. 🔄 Add push notifications (optional)
