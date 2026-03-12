# Hướng dẫn sửa lỗi API

## Lỗi hiện tại

Bạn đang gặp lỗi CORS khi kết nối đến API Gateway. Đây là lỗi phổ biến khi API chưa được cấu hình đúng.

## Giải pháp nhanh

### Cách 1: Fix CORS (Khuyến nghị)

Chạy các lệnh sau trong PowerShell:

```powershell
# Bước 1: Vào thư mục backend
cd amplify/backend

# Bước 2: Fix CORS cho API Gateway
./fix-cors.ps1

# Bước 3: Test API
./test-api.ps1
```

### Cách 2: Redeploy Lambda (Nếu cách 1 không work)

```powershell
# Bước 1: Vào thư mục backend
cd amplify/backend

# Bước 2: Redeploy Lambda function
./redeploy-lambda.ps1

# Bước 3: Fix CORS
./fix-cors.ps1

# Bước 4: Test API
./test-api.ps1
```

### Cách 3: Deploy lại toàn bộ (Nếu cách 1 và 2 không work)

```powershell
# Bước 1: Vào thư mục backend
cd amplify/backend

# Bước 2: Deploy lại toàn bộ
./deploy-complete-api.ps1

# Bước 3: Test API
./test-api.ps1
```

## Kiểm tra sau khi fix

1. Mở browser và vào trang profile
2. Mở Developer Tools (F12)
3. Vào tab Console
4. Tìm các log:
   - `✅ Profile loaded from DynamoDB` - Thành công!
   - `ℹ️ No profile found in DynamoDB` - OK, profile chưa tồn tại
   - `❌ Error fetching profile` - Vẫn còn lỗi

## Nếu vẫn lỗi

Hãy chụp màn hình:
1. Tab Console trong Developer Tools
2. Tab Network trong Developer Tools (filter: Fetch/XHR)

Và gửi cho tôi để debug tiếp.

## Lưu ý

- API URL: `https://xyp4wkszi7.execute-api.ap-southeast-1.amazonaws.com/prod`
- Lambda Function: `CandidateProfileAPI`
- DynamoDB Table: `CandidateProfiles`
- Region: `ap-southeast-1`

## Các file script đã tạo

- `fix-cors.ps1` - Fix CORS cho API Gateway
- `redeploy-lambda.ps1` - Deploy lại Lambda function
- `test-api.ps1` - Test API endpoints
- `deploy-complete-api.ps1` - Deploy toàn bộ infrastructure

Tất cả các file này đều ở trong thư mục `amplify/backend/`.
