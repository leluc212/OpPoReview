# Hệ Thống Thông Báo Real-time với DynamoDB

## Quick Start

### 1. Deploy Backend (5 phút)

```powershell
cd amplify\backend
.\create-notifications-lambda.ps1
```

Sau khi chạy xong, copy API endpoint hiển thị.

### 2. Cấu Hình Frontend

Thêm vào file `.env`:

```env
VITE_NOTIFICATIONS_API=https://xxxxxxxxxx.execute-api.ap-southeast-1.amazonaws.com
```

### 3. Restart Dev Server

```bash
npm run dev
```

### 4. Test

1. **Employer mua gói** → Admin nhận thông báo
2. **Admin duyệt gói** → Employer nhận thông báo

## Tính Năng

✅ **Real-time**: Tự động cập nhật mỗi 10 giây
✅ **Persistent**: Lưu trong DynamoDB, không mất khi clear cache
✅ **Cross-device**: Sync giữa các devices
✅ **Scalable**: Unlimited notifications
✅ **Bilingual**: Hỗ trợ tiếng Việt và tiếng Anh

## Kiến Trúc

```
Frontend (React)
    ↓
API Gateway (REST API)
    ↓
Lambda Function (Python)
    ↓
DynamoDB (Notifications Table)
```

## API Endpoints

- `GET /notifications/user/{userId}?role={role}` - Lấy notifications
- `GET /notifications/unread/{userId}?role={role}` - Lấy số chưa đọc
- `POST /notifications` - Tạo notification
- `PUT /notifications/{notificationId}` - Đánh dấu đã đọc
- `PUT /notifications/mark-all-read/{userId}?role={role}` - Đánh dấu tất cả
- `DELETE /notifications/{notificationId}` - Xóa notification

## Files

### Backend
- `amplify/backend/notifications-lambda.py` - Lambda handler
- `amplify/backend/create-notifications-lambda.ps1` - Deploy script

### Frontend
- `src/services/notificationApiService.js` - API service
- `src/components/Navbar.jsx` - Notification UI
- `src/pages/employer/Subscription.jsx` - Tạo notification khi mua gói
- `src/pages/admin/PackagesManagement.jsx` - Tạo notification khi duyệt gói

## Troubleshooting

### Không có thông báo?

1. Kiểm tra `.env` có `VITE_NOTIFICATIONS_API`
2. Restart dev server: `npm run dev`
3. Mở Console (F12) xem logs
4. Test API: `curl https://your-api.execute-api.ap-southeast-1.amazonaws.com/notifications`

### Lỗi API?

```bash
# Xem Lambda logs
aws logs tail /aws/lambda/notifications-handler --follow --region ap-southeast-1
```

## Chi Tiết

Xem file `DEPLOY-NOTIFICATIONS.md` để biết thêm chi tiết về:
- Kiến trúc hệ thống
- DynamoDB schema
- Monitoring và troubleshooting
- Cost estimation

## Demo

1. Đăng nhập Employer → Mua gói
2. Console log: `✅ Notification created for admin:`
3. Đăng nhập Admin → Click chuông 🔔
4. Thấy notification "Yêu cầu mua gói dịch vụ mới"
5. Admin duyệt gói
6. Console log: `✅ Notification created for employer:`
7. Đăng nhập Employer → Click chuông 🔔
8. Thấy notification "Gói dịch vụ đã được kích hoạt"

## Cost

**$0/month** (trong AWS Free Tier)
- DynamoDB: 25 GB storage, 25 WCU, 25 RCU
- Lambda: 1M requests/month
- API Gateway: 1M requests/month
