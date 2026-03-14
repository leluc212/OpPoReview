# Quy Trình Mua Gói Dịch Vụ

## Thông Tin Được Gửi Khi Mua Gói

Khi nhà tuyển dụng mua gói, hệ thống tự động gửi đầy đủ thông tin sau:

### 1. Thông tin do Frontend gửi:
```json
{
  "employerId": "emp-12345",           // ✅ ID nhà tuyển dụng
  "companyName": "Highlands Coffee",   // ✅ Tên nhà tuyển dụng
  "packageName": "Hot Search",         // ✅ Tên gói đã mua
  "duration": "24h"                    // ✅ Thời hạn gói (24h hoặc 7 ngày)
}
```

### 2. Thông tin do Lambda tự động tạo:
```json
{
  "subscriptionId": "uuid-auto-generated",  // ID đơn hàng (tự động)
  "price": 49000,                           // ✅ Số tiền (tự động tính)
  "purchaseDate": "2026-03-14",             // ✅ Ngày mua (tự động)
  "expiryDate": "2026-03-15",               // Ngày hết hạn (tự động tính)
  "status": "pending",                      // ✅ Trạng thái chờ duyệt
  "approvalStatus": "pending",              // ✅ Trạng thái phê duyệt
  "createdAt": "2026-03-14T10:30:00",       // Thời gian tạo
  "updatedAt": "2026-03-14T10:30:00"        // Thời gian cập nhật
}
```

## Flow Hoạt Động

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User chọn gói và thời hạn                                │
│    - Chọn: Hot Search                                       │
│    - Thời hạn: 24h                                          │
│    - Giá hiển thị: 49,000 VND                               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Kiểm tra số dư ví                                        │
│    - Lấy balance từ localStorage                            │
│    - So sánh với giá gói                                    │
│    - Nếu không đủ → Hiển thị modal "Số dư không đủ"        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Trừ tiền từ ví                                           │
│    - Balance cũ: 500,000 VND                                │
│    - Trừ đi: 49,000 VND                                     │
│    - Balance mới: 451,000 VND                               │
│    - Lưu vào localStorage                                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Gửi thông tin đến API                                    │
│    POST /subscriptions                                      │
│    {                                                         │
│      "employerId": "emp-12345",                             │
│      "companyName": "Highlands Coffee",                     │
│      "packageName": "Hot Search",                           │
│      "duration": "24h"                                      │
│    }                                                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Lambda xử lý                                             │
│    - Validate dữ liệu                                       │
│    - Tính giá từ PACKAGES: 49,000 VND                      │
│    - Tạo subscriptionId                                     │
│    - Tạo purchaseDate: 2026-03-14                           │
│    - Tính expiryDate: 2026-03-15 (24h sau)                 │
│    - Set status: "pending"                                  │
│    - Set approvalStatus: "pending"                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Lưu vào DynamoDB                                         │
│    Table: PackageSubscriptions                              │
│    - Tất cả thông tin được lưu                              │
│    - Có thể query theo employerId                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Trả về kết quả cho Frontend                              │
│    - Response chứa đầy đủ thông tin                         │
│    - Frontend hiển thị modal "Thanh toán thành công"        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. Admin duyệt gói                                          │
│    - Admin vào trang PackagesManagement                     │
│    - Xem tab "Chờ duyệt"                                    │
│    - Click nút "Duyệt"                                      │
│    - Gọi API: PUT /subscriptions/{id}                       │
│      {                                                       │
│        "status": "active",                                  │
│        "approvalStatus": "approved"                         │
│      }                                                       │
│    - Lambda cập nhật:                                       │
│      + purchaseDate = ngày duyệt                            │
│      + expiryDate = purchaseDate + duration                 │
│      + status = "active"                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. Gói được kích hoạt                                       │
│    - Tin tuyển dụng được boost                              │
│    - Hiển thị nổi bật theo gói đã mua                       │
│    - Hết hạn sau 24h hoặc 7 ngày                            │
└─────────────────────────────────────────────────────────────┘
```

## Bảng Giá Gói (Được Lưu Trong Lambda)

| Gói              | 24h       | 7 ngày    |
|------------------|-----------|-----------|
| Quick Boost      | 29,000    | 145,000   |
| Hot Search       | 49,000    | 245,000   |
| Spotlight Banner | 99,000    | 495,000   |
| Top Spotlight    | 149,000   | 745,000   |

## Trạng Thái Gói

### Status (Trạng thái hoạt động)
- `pending`: Chờ admin duyệt
- `active`: Đang hoạt động
- `expiring`: Sắp hết hạn (còn < 2 ngày)
- `expired`: Đã hết hạn

### Approval Status (Trạng thái phê duyệt)
- `pending`: Chờ duyệt
- `approved`: Đã duyệt

## Ví Dụ Dữ Liệu Trong DynamoDB

```json
{
  "subscriptionId": "f769267b-13a0-4bc9-b9c8-4639b59f4e5f",
  "employerId": "emp-12345",
  "companyName": "Highlands Coffee",
  "packageName": "Hot Search",
  "duration": "24h",
  "price": 49000,
  "purchaseDate": "2026-03-14",
  "expiryDate": "2026-03-15",
  "status": "pending",
  "approvalStatus": "pending",
  "createdAt": "2026-03-14T10:30:00.123456",
  "updatedAt": "2026-03-14T10:30:00.123456"
}
```

## Xử Lý Lỗi

### 1. Số dư không đủ
- Hiển thị modal "Số dư không đủ"
- Không trừ tiền
- Không gọi API
- Đề xuất nạp tiền

### 2. API lỗi
- Hoàn tiền vào ví
- Hiển thị thông báo lỗi
- Log error để debug

### 3. Gói không hợp lệ
- Lambda trả về 400 Bad Request
- Frontend hiển thị lỗi
- Hoàn tiền vào ví

## API Endpoints

### 1. Tạo gói mới (Employer)
```
POST /subscriptions
Body: {
  "employerId": "emp-12345",
  "companyName": "Highlands Coffee",
  "packageName": "Hot Search",
  "duration": "24h"
}
```

### 2. Lấy tất cả gói (Admin)
```
GET /subscriptions
```

### 3. Lấy gói theo employer
```
GET /subscriptions/employer/{employerId}
```

### 4. Duyệt gói (Admin)
```
PUT /subscriptions/{subscriptionId}
Body: {
  "status": "active",
  "approvalStatus": "approved"
}
```

### 5. Xóa gói (Admin)
```
DELETE /subscriptions/{subscriptionId}
```

## Kiểm Tra Dữ Liệu

### Xem tất cả gói trong DynamoDB
```powershell
aws dynamodb scan --table-name PackageSubscriptions --region ap-southeast-1
```

### Xem gói của một employer
```powershell
$API_ENDPOINT = "https://1hl7e4dg61.execute-api.ap-southeast-1.amazonaws.com"
Invoke-RestMethod -Uri "$API_ENDPOINT/subscriptions/employer/emp-12345" -Method GET
```

### Test tạo gói mới
```powershell
$API_ENDPOINT = "https://1hl7e4dg61.execute-api.ap-southeast-1.amazonaws.com"
$data = '{"employerId":"emp-test","companyName":"Test Co","packageName":"Quick Boost","duration":"24h"}'
Invoke-RestMethod -Uri "$API_ENDPOINT/subscriptions" -Method POST -Body $data -ContentType "application/json"
```

## Tóm Tắt

✅ **Tất cả thông tin bạn yêu cầu đều được gửi và lưu:**

1. ✅ Gói đã mua (packageName)
2. ✅ Số tiền (price - tự động tính)
3. ✅ Số ngày (duration)
4. ✅ Mua khi nào (purchaseDate - tự động)
5. ✅ ID nhà tuyển dụng (employerId)
6. ✅ Tên nhà tuyển dụng (companyName)
7. ✅ Trạng thái (status: pending, approvalStatus: pending)

**Hệ thống hoạt động tự động:**
- Frontend gửi 4 thông tin cơ bản
- Lambda tự động tính toán và thêm các thông tin còn lại
- Lưu vào DynamoDB
- Admin duyệt → Gói được kích hoạt
