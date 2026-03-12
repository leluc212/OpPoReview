# Troubleshooting API Issues

## Lỗi hiện tại

Từ screenshot, có 2 lỗi chính:

### 1. CORS Error
```
Access to fetch at 'https://xyp4wkszi7.execute-api.ap-southeast-1.amazonaws.com/prod/profile/...' 
from origin 'http://localhost:3001' has been blocked by CORS policy
```

**Nguyên nhân**: API Gateway chưa được cấu hình CORS đúng

**Giải pháp**:
```powershell
cd amplify/backend
./fix-cors.ps1
```

### 2. TypeError in candidateProfileService
```
TypeError: undefined is not an object (evaluating 'result.data.fullName')
```

**Nguyên nhân**: API trả về undefined hoặc không có data

**Giải pháp tạm thời**: Sử dụng fallback mode trong service

## Các bước khắc phục

### Bước 1: Kiểm tra Lambda function có tồn tại không

```powershell
aws lambda get-function --function-name CandidateProfileAPI --region ap-southeast-1
```

Nếu không tồn tại, chạy:
```powershell
cd amplify/backend
./deploy-complete-api.ps1
```

### Bước 2: Kiểm tra DynamoDB table

```powershell
aws dynamodb describe-table --table-name CandidateProfiles --region ap-southeast-1
```

Nếu không tồn tại, chạy:
```powershell
cd amplify/backend
node create-candidate-profile-table.js
```

### Bước 3: Test Lambda function trực tiếp

```powershell
cd amplify/backend
./redeploy-lambda.ps1
```

### Bước 4: Fix CORS

```powershell
cd amplify/backend
./fix-cors.ps1
```

### Bước 5: Test API

```powershell
cd amplify/backend
./test-api.ps1
```

## Giải pháp tạm thời

Nếu API vẫn không hoạt động, service sẽ tự động fallback về localStorage mode.

Để force sử dụng localStorage, thêm vào `.env`:
```
VITE_USE_MOCK_API=true
```

## Kiểm tra logs

### Lambda logs
```powershell
aws logs tail /aws/lambda/CandidateProfileAPI --follow --region ap-southeast-1
```

### API Gateway logs
```powershell
aws logs tail API-Gateway-Execution-Logs_xyp4wkszi7/prod --follow --region ap-southeast-1
```

## Các lỗi thường gặp

### 1. "Function not found"
- Lambda chưa được deploy
- Chạy `deploy-complete-api.ps1`

### 2. "Table not found"  
- DynamoDB table chưa được tạo
- Chạy `create-candidate-profile-table.js`

### 3. "Access Denied"
- Lambda không có quyền truy cập DynamoDB
- Kiểm tra IAM role: `CandidateProfileLambdaRole`

### 4. CORS errors
- API Gateway chưa cấu hình CORS
- Chạy `fix-cors.ps1`

### 5. "Cannot read property 'data' of undefined"
- API trả về format không đúng
- Kiểm tra Lambda response format
- Service sẽ tự động fallback về localStorage

## Debug mode

Để bật debug mode, mở Console trong browser và xem:
- Network tab: Kiểm tra API requests/responses
- Console tab: Xem logs từ candidateProfileService

Service sẽ log:
- `✅ Profile loaded from DynamoDB` - Thành công
- `ℹ️ No profile found in DynamoDB` - Profile chưa tồn tại (OK)
- `❌ Error fetching profile` - Có lỗi (xem error message)
