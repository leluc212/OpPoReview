# Package Subscriptions Setup Guide

Hướng dẫn thiết lập hệ thống quản lý gói dịch vụ (Package Subscriptions) với DynamoDB.

## Cấu trúc Database

### Bảng: PackageSubscriptions

**Attributes:**
- `subscriptionId` (String, Primary Key) - ID duy nhất của gói đăng ký
- `employerId` (String, GSI) - ID của nhà tuyển dụng
- `companyName` (String) - Tên công ty
- `packageName` (String) - Tên gói dịch vụ
  - Quick Boost
  - Hot Search
  - Spotlight Banner
  - Top Spotlight
- `duration` (String) - Thời hạn gói
  - 24h
  - 7 ngày
- `price` (Number) - Giá gói (VND)
- `purchaseDate` (String) - Ngày mua (YYYY-MM-DD)
- `expiryDate` (String) - Ngày hết hạn (YYYY-MM-DD)
- `status` (String) - Trạng thái gói
  - pending: Chờ duyệt
  - active: Đang hoạt động
  - expiring: Sắp hết hạn
  - expired: Đã hết hạn
- `approvalStatus` (String) - Trạng thái phê duyệt
  - pending: Chờ duyệt
  - approved: Đã duyệt
- `createdAt` (String) - Thời gian tạo (ISO format)
- `updatedAt` (String) - Thời gian cập nhật (ISO format)

**Global Secondary Index:**
- `EmployerIndex`: employerId (HASH) + purchaseDate (RANGE)

## Bảng giá gói dịch vụ

| Gói dịch vụ | 24h | 7 ngày |
|-------------|-----|--------|
| Quick Boost | 29,000 VND | 145,000 VND |
| Hot Search | 49,000 VND | 245,000 VND |
| Spotlight Banner | 99,000 VND | 495,000 VND |
| Top Spotlight | 149,000 VND | 745,000 VND |

## Các bước triển khai

### 1. Tạo bảng DynamoDB

```powershell
cd amplify/backend
./create-package-subscriptions-table.ps1
```

Script này sẽ:
- Tạo bảng `PackageSubscriptions` với billing mode PAY_PER_REQUEST
- Tạo Global Secondary Index `EmployerIndex`
- Thêm tags cho project

### 2. Deploy Lambda Function và API Gateway

```powershell
./deploy-package-subscriptions-api.ps1
```

Script này sẽ:
- Tạo Lambda function `PackageSubscriptionsFunction`
- Tạo IAM role với quyền truy cập DynamoDB
- Tạo HTTP API Gateway với các endpoints:
  - `GET /subscriptions` - Lấy tất cả gói đăng ký
  - `GET /subscriptions/employer/{employerId}` - Lấy gói theo nhà tuyển dụng
  - `POST /subscriptions` - Tạo gói mới
  - `PUT /subscriptions/{subscriptionId}` - Cập nhật gói (duyệt/từ chối)
  - `DELETE /subscriptions/{subscriptionId}` - Xóa gói
- Cấu hình CORS cho frontend

### 3. Test API

```powershell
./test-package-subscriptions-api.ps1
```

Script này sẽ test tất cả các endpoints và tạo dữ liệu mẫu.

### 4. Thêm dữ liệu mẫu

```powershell
./add-sample-subscriptions.ps1
```

Script này sẽ thêm 15 gói đăng ký mẫu với các trạng thái khác nhau.

## API Endpoints

### GET /subscriptions
Lấy tất cả gói đăng ký

**Response:**
```json
[
  {
    "subscriptionId": "uuid",
    "employerId": "emp-001",
    "companyName": "Highlands Coffee",
    "packageName": "Quick Boost",
    "duration": "7 ngày",
    "price": 145000,
    "purchaseDate": "2026-03-14",
    "expiryDate": "2026-03-21",
    "status": "active",
    "approvalStatus": "approved",
    "createdAt": "2026-03-14T10:30:00",
    "updatedAt": "2026-03-14T10:30:00"
  }
]
```

### GET /subscriptions/employer/{employerId}
Lấy gói đăng ký theo nhà tuyển dụng

**Response:** Tương tự GET /subscriptions

### POST /subscriptions
Tạo gói đăng ký mới

**Request Body:**
```json
{
  "employerId": "emp-001",
  "companyName": "Highlands Coffee",
  "packageName": "Quick Boost",
  "duration": "7 ngày"
}
```

**Response:**
```json
{
  "subscriptionId": "uuid",
  "employerId": "emp-001",
  "companyName": "Highlands Coffee",
  "packageName": "Quick Boost",
  "duration": "7 ngày",
  "price": 145000,
  "purchaseDate": "2026-03-14",
  "expiryDate": "2026-03-21",
  "status": "pending",
  "approvalStatus": "pending",
  "createdAt": "2026-03-14T10:30:00",
  "updatedAt": "2026-03-14T10:30:00"
}
```

### PUT /subscriptions/{subscriptionId}
Cập nhật gói đăng ký (duyệt/từ chối)

**Request Body:**
```json
{
  "status": "active",
  "approvalStatus": "approved"
}
```

**Response:** Trả về item đã cập nhật

### DELETE /subscriptions/{subscriptionId}
Xóa gói đăng ký

**Response:**
```json
{
  "message": "Subscription deleted successfully"
}
```

## Tích hợp với Frontend

### 1. Lấy API Endpoint

Sau khi deploy, bạn sẽ nhận được API endpoint:
```
https://{api-id}.execute-api.ap-southeast-1.amazonaws.com
```

### 2. Cập nhật Frontend

Thêm API endpoint vào file `.env`:
```
VITE_PACKAGE_SUBSCRIPTIONS_API=https://{api-id}.execute-api.ap-southeast-1.amazonaws.com
```

### 3. Tạo API Service

Tạo file `src/services/packageSubscriptionsApi.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_PACKAGE_SUBSCRIPTIONS_API;

export const packageSubscriptionsApi = {
  // Get all subscriptions
  getAllSubscriptions: async () => {
    const response = await fetch(`${API_BASE_URL}/subscriptions`);
    return response.json();
  },

  // Get subscriptions by employer
  getEmployerSubscriptions: async (employerId) => {
    const response = await fetch(`${API_BASE_URL}/subscriptions/employer/${employerId}`);
    return response.json();
  },

  // Create new subscription
  createSubscription: async (data) => {
    const response = await fetch(`${API_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Approve subscription
  approveSubscription: async (subscriptionId) => {
    const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'active',
        approvalStatus: 'approved'
      })
    });
    return response.json();
  },

  // Delete subscription
  deleteSubscription: async (subscriptionId) => {
    const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};
```

### 4. Cập nhật PackagesManagement Component

Thay thế state cứng bằng API calls:

```javascript
import { packageSubscriptionsApi } from '../../services/packageSubscriptionsApi';

// Load subscriptions from API
useEffect(() => {
  const loadSubscriptions = async () => {
    try {
      const data = await packageSubscriptionsApi.getAllSubscriptions();
      setPurchases(data);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  };
  
  loadSubscriptions();
}, []);

// Update approve handler
const handleApprove = async (subscriptionId) => {
  try {
    const updated = await packageSubscriptionsApi.approveSubscription(subscriptionId);
    setPurchases(prev => prev.map(p => 
      p.subscriptionId === subscriptionId ? updated : p
    ));
  } catch (error) {
    console.error('Error approving subscription:', error);
  }
};
```

## Monitoring và Maintenance

### Kiểm tra logs Lambda
```powershell
aws logs tail /aws/lambda/PackageSubscriptionsFunction --follow --region ap-southeast-1
```

### Xem dữ liệu trong DynamoDB
```powershell
aws dynamodb scan --table-name PackageSubscriptions --region ap-southeast-1
```

### Backup dữ liệu
```powershell
aws dynamodb create-backup --table-name PackageSubscriptions --backup-name PackageSubscriptions-backup-$(Get-Date -Format "yyyyMMdd") --region ap-southeast-1
```

## Troubleshooting

### Lỗi: Table already exists
- Bảng đã được tạo trước đó, có thể bỏ qua hoặc xóa bảng cũ

### Lỗi: IAM role propagation
- Đợi 10-15 giây sau khi tạo IAM role trước khi deploy Lambda

### Lỗi: CORS
- Kiểm tra API Gateway CORS configuration
- Đảm bảo frontend gửi đúng headers

### Lỗi: Lambda timeout
- Tăng timeout trong Lambda configuration (hiện tại: 30s)
- Kiểm tra DynamoDB performance

## Next Steps

1. Thêm authentication/authorization cho API
2. Implement payment gateway integration
3. Thêm email notifications khi gói được duyệt
4. Tạo scheduled Lambda để tự động cập nhật status (expiring/expired)
5. Thêm analytics và reporting
