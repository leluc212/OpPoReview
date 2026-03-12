# 🚀 Hướng dẫn Setup API cho Quick Job

Tài liệu này hướng dẫn cách tạo API Gateway và Lambda để kết nối form PostQuickJob với bảng DynamoDB PostQuickJob.

## 📋 Tổng quan

Khi người dùng điền form và bấm "Đăng bài ngay", dữ liệu sẽ được:
1. ✅ Validate trên frontend
2. 💰 Trừ phí từ ví Escrow
3. 📤 Gửi lên API Gateway
4. ⚡ Lambda xử lý và lưu vào DynamoDB
5. ✅ Trả về kết quả cho frontend

## 🏗️ Kiến trúc

```
Frontend (PostQuickJob.jsx)
    ↓
quickJobService.js
    ↓
API Gateway (HTTP API)
    ↓
Lambda Function (quick-job-lambda.py)
    ↓
DynamoDB (PostQuickJob table)
```

## 📦 Các file đã tạo

1. **create-quick-job-api.ps1** - Script tạo toàn bộ infrastructure
2. **update-quick-job-service-url.ps1** - Script cập nhật API URL vào service
3. **test-quick-job-api.html** - Trang test API
4. **amplify/backend/quick-job-lambda.py** - Lambda function (đã có sẵn)
5. **src/services/quickJobService.js** - Service kết nối API (đã có sẵn)
6. **src/pages/employer/PostQuickJob.jsx** - Form đăng bài (đã tích hợp)

## 🚀 Các bước triển khai

### Bước 1: Tạo bảng DynamoDB (nếu chưa có)

```powershell
# Chạy script tạo bảng PostQuickJob
./create-quick-job-table.ps1
```

**Kết quả mong đợi:**
```
✅ PostQuickJob table created successfully!
✅ Table is now active!
```

### Bước 2: Tạo API Gateway và Lambda

```powershell
# Chạy script tạo API infrastructure
./create-quick-job-api.ps1
```

**Script này sẽ:**
- ✅ Tạo IAM role cho Lambda
- ✅ Gán quyền truy cập DynamoDB
- ✅ Package Lambda function
- ✅ Tạo Lambda function
- ✅ Tạo API Gateway (HTTP API)
- ✅ Tạo các routes (POST, GET, PUT, DELETE)
- ✅ Enable CORS
- ✅ Lưu config vào `quick-job-api-config.json`

**Kết quả mong đợi:**
```
🎉 Quick Job API Setup Complete!

📋 API Details:
  API ID: abc123xyz
  Lambda: quick-job-handler
  Table: PostQuickJob

🔗 API Endpoint:
  https://abc123xyz.execute-api.ap-southeast-1.amazonaws.com

📝 Update this URL in src/services/quickJobService.js:
  const API_BASE_URL = 'https://abc123xyz.execute-api.ap-southeast-1.amazonaws.com';
```

### Bước 3: Cập nhật API URL trong service

```powershell
# Tự động cập nhật API URL vào quickJobService.js
./update-quick-job-service-url.ps1
```

**Kết quả mong đợi:**
```
✅ Service file updated successfully!

📝 Updated line:
  const API_BASE_URL = 'https://abc123xyz.execute-api.ap-southeast-1.amazonaws.com';

🎉 Quick Job Service is now connected to the API!
```

### Bước 4: Test API

#### Option 1: Dùng file HTML test

```powershell
# Mở file test trong browser
start test-quick-job-api.html
```

1. Cập nhật API Endpoint trong form
2. Điền thông tin công việc
3. Bấm "Tạo Quick Job"
4. Kiểm tra response

#### Option 2: Test trực tiếp trên ứng dụng

1. Chạy ứng dụng React:
```bash
npm run dev
```

2. Đăng nhập với tài khoản employer
3. Vào menu "Quick Jobs" → "Đăng bài mới"
4. Điền form và bấm "Đăng bài ngay"

### Bước 5: Kiểm tra dữ liệu trong DynamoDB

```powershell
# Xem tất cả items trong bảng
aws dynamodb scan --table-name PostQuickJob --region ap-southeast-1

# Hoặc xem với format đẹp hơn
aws dynamodb scan --table-name PostQuickJob --region ap-southeast-1 --output table
```

## 📊 API Endpoints

### POST /quick-jobs
Tạo quick job mới

**Request Body:**
```json
{
  "idJob": "QJOB-20260313-A7B3C",
  "employerId": "us-east-1:12345678-...",
  "employerEmail": "employer@example.com",
  "companyName": "Nhà hàng ABC",
  "title": "Ca Tối - Nhân viên Phục vụ",
  "location": "Quận 1, TP.HCM",
  "jobType": "part-time",
  "hourlyRate": 35000,
  "startTime": "18:00",
  "endTime": "23:00",
  "totalHours": 5,
  "totalSalary": 175000,
  "description": "Mô tả công việc...",
  "requirements": "Yêu cầu ứng viên...",
  "status": "pending",
  "fee": 175000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quick job created successfully",
  "data": { ... }
}
```

### GET /quick-jobs/active
Lấy tất cả quick jobs đang active

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "idJob": "QJOB-20260313-A7B3C",
      "title": "Ca Tối - Nhân viên Phục vụ",
      "status": "active",
      ...
    }
  ]
}
```

### GET /quick-jobs/employer/{employerId}
Lấy tất cả quick jobs của một employer

### GET /quick-jobs/{idJob}
Lấy chi tiết một quick job

### PUT /quick-jobs/{idJob}
Cập nhật quick job

### DELETE /quick-jobs/{idJob}
Xóa quick job (soft delete)

### POST /quick-jobs/{idJob}/views
Tăng số lượt xem

## 🔍 Troubleshooting

### Lỗi: "Cannot connect to API"

**Nguyên nhân:** API URL chưa được cập nhật hoặc sai

**Giải pháp:**
1. Kiểm tra file `quick-job-api-config.json`
2. Chạy lại `./update-quick-job-service-url.ps1`
3. Hoặc cập nhật thủ công trong `src/services/quickJobService.js`:
```javascript
const API_BASE_URL = 'https://YOUR_API_ID.execute-api.ap-southeast-1.amazonaws.com';
```

### Lỗi: "CORS error"

**Nguyên nhân:** CORS chưa được enable đúng

**Giải pháp:**
```powershell
# Enable CORS cho API
aws apigatewayv2 update-api `
    --api-id YOUR_API_ID `
    --cors-configuration "AllowOrigins=*,AllowMethods=GET,POST,PUT,DELETE,OPTIONS,AllowHeaders=Content-Type,Authorization" `
    --region ap-southeast-1
```

### Lỗi: "Access Denied" khi Lambda gọi DynamoDB

**Nguyên nhân:** IAM role chưa có quyền

**Giải pháp:**
```powershell
# Kiểm tra policy của Lambda role
aws iam get-role-policy `
    --role-name quick-job-handler-role `
    --policy-name DynamoDBQuickJobAccess `
    --region ap-southeast-1

# Nếu không có, chạy lại create-quick-job-api.ps1
```

### Lỗi: "Using offline mode" trong console

**Nguyên nhân:** API không khả dụng, service đang dùng localStorage fallback

**Giải pháp:**
1. Kiểm tra API endpoint có đúng không
2. Test API bằng curl hoặc Postman
3. Kiểm tra Lambda logs:
```powershell
aws logs tail /aws/lambda/quick-job-handler --follow --region ap-southeast-1
```

## 📝 Kiểm tra logs

### Lambda logs
```powershell
# Xem logs realtime
aws logs tail /aws/lambda/quick-job-handler --follow --region ap-southeast-1

# Xem logs trong 1 giờ qua
aws logs tail /aws/lambda/quick-job-handler --since 1h --region ap-southeast-1
```

### API Gateway logs
```powershell
# Enable logging cho API Gateway
aws apigatewayv2 update-stage `
    --api-id YOUR_API_ID `
    --stage-name $default `
    --access-log-settings "DestinationArn=arn:aws:logs:ap-southeast-1:ACCOUNT_ID:log-group:api-gateway-logs,Format=$context.requestId" `
    --region ap-southeast-1
```

## 🧪 Test cases

### Test 1: Tạo quick job thành công
1. Điền đầy đủ thông tin
2. Lương > 31.875 VNĐ
3. Có đủ số dư trong ví
4. Bấm "Đăng bài ngay"
5. ✅ Thấy modal thành công
6. ✅ Dữ liệu xuất hiện trong DynamoDB

### Test 2: Lỗi lương quá thấp
1. Điền lương ≤ 31.875 VNĐ
2. Bấm "Đăng bài ngay"
3. ✅ Thấy lỗi validation

### Test 3: Lỗi số dư không đủ
1. Điền thông tin với tổng lương > số dư ví
2. Bấm "Đăng bài ngay"
3. ✅ Thấy modal lỗi "Số dư không đủ"
4. ✅ Có nút "Nạp tiền"

### Test 4: Offline mode fallback
1. Tắt internet hoặc sai API URL
2. Điền form và submit
3. ✅ Dữ liệu lưu vào localStorage
4. ✅ Thấy thông báo "Using offline mode"

## 🔐 Security Notes

1. **Authentication:** API hiện tại chưa có authentication. Trong production, cần:
   - Enable Cognito Authorizer cho API Gateway
   - Validate JWT token trong Lambda
   - Kiểm tra quyền sở hữu job khi update/delete

2. **Input Validation:** Lambda đã validate các trường bắt buộc, nhưng nên thêm:
   - Validate format email
   - Validate phone number
   - Sanitize input để tránh injection

3. **Rate Limiting:** Nên thêm throttling cho API để tránh abuse

## 📚 Tài liệu tham khảo

- [AWS Lambda Python](https://docs.aws.amazon.com/lambda/latest/dg/lambda-python.html)
- [API Gateway HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)

## ✅ Checklist hoàn thành

- [ ] Bảng PostQuickJob đã được tạo
- [ ] Lambda function đã được deploy
- [ ] API Gateway đã được tạo và config
- [ ] CORS đã được enable
- [ ] API URL đã được cập nhật trong quickJobService.js
- [ ] Test API thành công với test-quick-job-api.html
- [ ] Test form PostQuickJob trên ứng dụng
- [ ] Dữ liệu xuất hiện trong DynamoDB
- [ ] Escrow wallet hoạt động đúng
- [ ] Offline mode fallback hoạt động

## 🎉 Kết luận

Sau khi hoàn thành các bước trên, hệ thống Quick Job sẽ:
- ✅ Lưu dữ liệu vào DynamoDB thay vì localStorage
- ✅ Có API để frontend và backend giao tiếp
- ✅ Có fallback mode khi API không khả dụng
- ✅ Tích hợp với Escrow wallet
- ✅ Sẵn sàng cho production

**Chúc bạn triển khai thành công! 🚀**
