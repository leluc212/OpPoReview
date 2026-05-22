# Hệ Thống Quản Lý Gói Dịch Vụ (Package Subscription System)

## Tổng Quan

Hệ thống cho phép Nhà tuyển dụng mua các gói dịch vụ và Admin phê duyệt các yêu cầu mua gói.

## Kiến Trúc Hệ Thống

### 1. Database: DynamoDB Table `PackageSubscriptions`

**Primary Key:**
- `subscriptionId` (String) - Partition Key

**Global Secondary Indexes:**
- `EmployerIndex`: employerId (Hash Key)
- `StatusIndex`: status (Hash Key)

**Attributes:**
```json
{
  "subscriptionId": "SUB-20260521-ABC123",
  "employerId": "cognito-user-id",
  "companyName": "Tên công ty",
  "packageName": "Quick Boost | Hot Search | Spotlight Banner | Top Spotlight",
  "duration": "24h | 7 ngày",
  "price": 29000,
  "purchaseDate": "2026-05-21",
  "expiryDate": "2026-05-28",
  "status": "pending | active | expired",
  "approvalStatus": "pending | approved | rejected",
  "createdAt": "2026-05-21T00:00:00.000Z",
  "updatedAt": "2026-05-21T00:00:00.000Z"
}
```

### 2. Lambda Function: `package-subscriptions-handler`

**Environment Variables:**
- `TABLE_NAME`: PackageSubscriptions

**API Endpoints:**

#### POST /subscriptions
Tạo yêu cầu mua gói mới (từ Employer)

**Request Body:**
```json
{
  "employerId": "string",
  "companyName": "string",
  "packageName": "string",
  "duration": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription request created successfully",
  "data": {
    "subscriptionId": "SUB-20260521-ABC123",
    ...
  }
}
```

#### GET /subscriptions
Lấy tất cả subscriptions (cho Admin)

**Response:**
```json
[
  {
    "subscriptionId": "SUB-20260521-ABC123",
    "employerId": "...",
    ...
  }
]
```

#### GET /subscriptions/employer/{employerId}
Lấy subscriptions của một employer

#### GET /subscriptions/{subscriptionId}
Lấy chi tiết một subscription

#### PUT /subscriptions/{subscriptionId}
Cập nhật subscription (Admin duyệt/từ chối)

**Request Body:**
```json
{
  "status": "active",
  "approvalStatus": "approved"
}
```

#### DELETE /subscriptions/{subscriptionId}
Xóa subscription

### 3. API Gateway

**API ID:** p0nd7frlhg
**Endpoint:** https://p0nd7frlhg.execute-api.ap-southeast-1.amazonaws.com

**CORS Configuration:**
- Allow Origins: *
- Allow Methods: GET, POST, PUT, DELETE, OPTIONS
- Allow Headers: Content-Type, Authorization

## Luồng Hoạt Động

### A. Nhà Tuyển Dụng Mua Gói

1. **Truy cập trang Gói Dịch Vụ**
   - URL: `/employer/subscription`
   - Xem các gói: Quick Boost, Hot Search, Spotlight Banner, Top Spotlight

2. **Chọn gói và thời hạn**
   - Chọn gói muốn mua
   - Chọn thời hạn: 24h hoặc 7 ngày

3. **Xác nhận mua**
   - Hệ thống kiểm tra số dư ví
   - Nếu đủ tiền: Trừ tiền từ ví
   - Gửi yêu cầu đến API: `POST /subscriptions`
   - Status: `pending`, ApprovalStatus: `pending`

4. **Nhận thông báo**
   - Modal hiển thị: "Yêu cầu đã được gửi đến admin"
   - Chờ admin phê duyệt

### B. Admin Phê Duyệt

1. **Truy cập trang Quản Lý Gói Dịch Vụ**
   - URL: `/admin/packages`
   - Xem dashboard thống kê

2. **Tab "Chờ duyệt"**
   - Hiển thị các gói có `approvalStatus = 'pending'`
   - Thông tin: Nhà tuyển dụng, Gói, Thời hạn, Giá

3. **Nhấn nút "Duyệt"**
   - Gọi API: `PUT /subscriptions/{subscriptionId}`
   - Body: `{ "status": "active", "approvalStatus": "approved" }`
   - Lambda tự động tính `purchaseDate` và `expiryDate`

4. **Gói được kích hoạt**
   - Chuyển sang tab "Đã duyệt"
   - Status: `active`
   - Nhà tuyển dụng có thể sử dụng gói

### C. Hết Hạn Gói

- Khi `expiryDate` < ngày hiện tại
- Status tự động chuyển thành `expired`
- Hiển thị trong tab "Đã duyệt" với badge "Đã hết hạn"

## Giá Gói Dịch Vụ

| Gói | 24h | 7 ngày |
|-----|-----|--------|
| Quick Boost | 29,000 VND | 145,000 VND |
| Hot Search | 49,000 VND | 245,000 VND |
| Spotlight Banner | 99,000 VND | 495,000 VND |
| Top Spotlight | 149,000 VND | 745,000 VND |

## Files Liên Quan

### Backend
- `amplify/backend/package-subscriptions-lambda.py` - Lambda handler
- `amplify/backend/create-subscriptions-lambda-simple.ps1` - Deploy script

### Frontend
- `src/pages/employer/Subscription.jsx` - Trang mua gói (Employer)
- `src/pages/admin/PackagesManagement.jsx` - Trang quản lý (Admin)

### Configuration
- `.env` - API endpoint: `VITE_PACKAGE_SUBSCRIPTIONS_API`

## Testing

### 1. Test Employer Flow

```bash
# Đăng nhập với tài khoản Employer
# Vào trang /employer/subscription
# Chọn gói và mua
# Kiểm tra modal thành công
```

### 2. Test Admin Flow

```bash
# Đăng nhập với tài khoản Admin
# Vào trang /admin/packages
# Tab "Chờ duyệt" - Xem yêu cầu mới
# Nhấn "Duyệt"
# Kiểm tra chuyển sang tab "Đã duyệt"
```

### 3. Test API Directly

```bash
# Get all subscriptions
curl https://p0nd7frlhg.execute-api.ap-southeast-1.amazonaws.com/subscriptions

# Create subscription
curl -X POST https://p0nd7frlhg.execute-api.ap-southeast-1.amazonaws.com/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "employerId": "test-employer-123",
    "companyName": "Test Company",
    "packageName": "Quick Boost",
    "duration": "24h"
  }'

# Approve subscription
curl -X PUT https://p0nd7frlhg.execute-api.ap-southeast-1.amazonaws.com/subscriptions/SUB-20260521-ABC123 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active",
    "approvalStatus": "approved"
  }'
```

## Deployment

### Deploy Infrastructure

```powershell
cd amplify/backend
.\create-subscriptions-lambda-simple.ps1
```

### Update Lambda Code

```powershell
cd amplify/backend
Compress-Archive -Path package-subscriptions-lambda.py -DestinationPath package-subscriptions-lambda.zip -Force
aws lambda update-function-code --function-name package-subscriptions-handler --zip-file fileb://package-subscriptions-lambda.zip --region ap-southeast-1
```

## Troubleshooting

### Lỗi: "Subscription request failed"
- Kiểm tra API endpoint trong `.env`
- Kiểm tra Lambda logs: CloudWatch `/aws/lambda/package-subscriptions-handler`
- Kiểm tra CORS configuration

### Lỗi: "Insufficient balance"
- Kiểm tra số dư ví employer
- Nạp thêm tiền vào ví

### Gói không hiển thị sau khi duyệt
- Kiểm tra DynamoDB table `PackageSubscriptions`
- Kiểm tra `status` và `approvalStatus`
- Refresh trang admin

## Future Enhancements

1. **Email Notifications**
   - Gửi email khi admin duyệt gói
   - Gửi email nhắc nhở trước khi hết hạn

2. **Auto-expire Jobs**
   - Cron job kiểm tra `expiryDate`
   - Tự động chuyển status thành `expired`

3. **Refund System**
   - Admin có thể từ chối và hoàn tiền
   - Lưu lịch sử refund

4. **Package Usage Analytics**
   - Theo dõi hiệu quả của từng gói
   - Báo cáo cho employer

5. **Discount Codes**
   - Hỗ trợ mã giảm giá
   - Chương trình khuyến mãi
