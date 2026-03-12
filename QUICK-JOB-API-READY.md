# ✅ Quick Job API đã sẵn sàng!

## 🎉 Hoàn thành setup

API và Lambda cho PostQuickJob đã được tạo và cấu hình thành công!

## 📋 Thông tin API

**API Endpoint:**
```
https://6zw89pkuxb.execute-api.ap-southeast-1.amazonaws.com
```

**Lambda Function:** `quick-job-handler`

**DynamoDB Table:** `PostQuickJob`

**Region:** `ap-southeast-1`

## ✅ Đã hoàn thành

- [x] Tạo IAM role cho Lambda với quyền DynamoDB
- [x] Package và deploy Lambda function
- [x] Tạo API Gateway (HTTP API)
- [x] Tạo 8 routes (POST, GET, PUT, DELETE)
- [x] Enable CORS
- [x] Cập nhật API URL trong `src/services/quickJobService.js`
- [x] Lưu config vào `quick-job-api-config.json`

## 🚀 API Routes

| Method | Path | Mô tả |
|--------|------|-------|
| POST | `/quick-jobs` | Tạo quick job mới |
| GET | `/quick-jobs/active` | Lấy tất cả quick jobs đang active |
| GET | `/quick-jobs/employer/{employerId}` | Lấy quick jobs của employer |
| GET | `/quick-jobs/{idJob}` | Lấy chi tiết một quick job |
| PUT | `/quick-jobs/{idJob}` | Cập nhật quick job |
| DELETE | `/quick-jobs/{idJob}` | Xóa quick job (soft delete) |
| POST | `/quick-jobs/{idJob}/views` | Tăng số lượt xem |
| OPTIONS | `/{proxy+}` | CORS preflight |

## 🧪 Test API

### Option 1: Dùng file HTML test
File `test-quick-job-api.html` đã được mở trong browser. 

**Các bước:**
1. API Endpoint đã được điền sẵn
2. Điền thông tin công việc vào form
3. Bấm "Tạo Quick Job"
4. Kiểm tra response

### Option 2: Test trên ứng dụng React

1. Chạy ứng dụng:
```bash
npm run dev
```

2. Đăng nhập với tài khoản employer

3. Vào menu "Quick Jobs" → "Đăng bài mới"

4. Điền form PostQuickJob:
   - Tiêu đề: "Ca Tối - Nhân viên Phục vụ"
   - Địa điểm: "Quận 1, TP.HCM"
   - Loại hình: "Bán thời gian"
   - Lương: 35000 VNĐ/giờ
   - Giờ bắt đầu: 18:00
   - Giờ kết thúc: 23:00
   - Mô tả và yêu cầu

5. Bấm "Đăng bài ngay"

6. Kiểm tra:
   - Modal thành công xuất hiện
   - Số dư ví bị trừ
   - Dữ liệu lưu vào DynamoDB

### Option 3: Test bằng AWS CLI

```powershell
# Test GET /quick-jobs/active
aws lambda invoke `
    --function-name quick-job-handler `
    --payload '{"httpMethod":"GET","path":"/quick-jobs/active"}' `
    --region ap-southeast-1 `
    response.json

Get-Content response.json
```

## 🔍 Kiểm tra dữ liệu trong DynamoDB

```powershell
# Xem tất cả items
aws dynamodb scan --table-name PostQuickJob --region ap-southeast-1

# Xem với format table
aws dynamodb scan --table-name PostQuickJob --region ap-southeast-1 --output table

# Đếm số lượng items
aws dynamodb scan --table-name PostQuickJob --region ap-southeast-1 --select COUNT
```

## 📊 Kiểm tra Lambda logs

```powershell
# Xem logs realtime
aws logs tail /aws/lambda/quick-job-handler --follow --region ap-southeast-1

# Xem logs trong 1 giờ qua
aws logs tail /aws/lambda/quick-job-handler --since 1h --region ap-southeast-1
```

## 🔄 Luồng hoạt động

Khi người dùng bấm "Đăng bài ngay":

1. **Frontend (PostQuickJob.jsx)**
   - Validate form data
   - Kiểm tra số dư ví
   - Trừ phí từ ví Escrow

2. **Service (quickJobService.js)**
   - Tạo job ID: `QJOB-YYYYMMDD-XXXXX`
   - Gọi API: `POST /quick-jobs`

3. **API Gateway**
   - Nhận request
   - Route đến Lambda

4. **Lambda (quick-job-lambda.py)**
   - Validate dữ liệu
   - Lưu vào DynamoDB
   - Trả về response

5. **DynamoDB (PostQuickJob)**
   - Lưu trữ job data
   - Index theo employerId và status

6. **Frontend**
   - Nhận response thành công
   - Hiển thị modal
   - Chuyển đến trang Quick Jobs

## 💡 Lưu ý

### Offline Mode Fallback
Nếu API không khả dụng, service tự động chuyển sang localStorage:
- Dữ liệu lưu local
- Console log: "Using offline mode"
- Vẫn có thể sử dụng ứng dụng

### Escrow Wallet
- Phí = Tổng lương (hourlyRate × totalHours)
- Số tiền được giữ trong Escrow
- Khi hoàn thành: 85% cho ứng viên, 15% cho platform

### Validation
- Lương phải > 31.875 VNĐ/giờ
- Phải có đủ số dư trong ví
- Tất cả trường bắt buộc phải điền

## 🐛 Troubleshooting

### Lỗi: "Cannot connect to API"
- Kiểm tra API endpoint trong `quickJobService.js`
- Kiểm tra internet connection
- Xem Lambda logs

### Lỗi: "CORS error"
- CORS đã được enable
- Nếu vẫn lỗi, chạy:
```powershell
aws apigatewayv2 update-api `
    --api-id 6zw89pkuxb `
    --cors-configuration "AllowOrigins=*,AllowMethods=GET,POST,PUT,DELETE,OPTIONS,AllowHeaders=Content-Type,Authorization" `
    --region ap-southeast-1
```

### Lỗi: "Access Denied" trong Lambda
- Kiểm tra IAM role có quyền DynamoDB
- Xem Lambda logs để biết chi tiết

## 📚 Files quan trọng

- `src/services/quickJobService.js` - Service kết nối API
- `src/pages/employer/PostQuickJob.jsx` - Form đăng bài
- `amplify/backend/quick-job-lambda.py` - Lambda function
- `quick-job-api-config.json` - API configuration
- `test-quick-job-api.html` - Test page
- `DYNAMODB-SCHEMA.md` - Database schema

## 🎯 Bước tiếp theo

1. **Test API** bằng file HTML hoặc trên ứng dụng
2. **Kiểm tra dữ liệu** trong DynamoDB
3. **Xem logs** để debug nếu có lỗi
4. **Tích hợp authentication** (Cognito) nếu cần

## ✨ Kết luận

Hệ thống Quick Job API đã sẵn sàng! Bạn có thể:
- ✅ Tạo quick jobs từ form
- ✅ Lưu vào DynamoDB
- ✅ Tích hợp Escrow wallet
- ✅ Có fallback mode khi offline

**Chúc bạn sử dụng thành công! 🚀**
