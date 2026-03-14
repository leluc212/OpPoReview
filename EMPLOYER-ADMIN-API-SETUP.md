# Hướng dẫn Setup API Admin cho Quản lý Nhà Tuyển Dụng

## Tổng quan

Tài liệu này hướng dẫn cách cập nhật hệ thống để trang quản lý nhà tuyển dụng lấy dữ liệu real-time từ DynamoDB thông qua API.

## Các thay đổi đã thực hiện

### 1. Frontend Changes

#### Tạo Admin Service mới
- **File**: `src/services/adminEmployerService.js`
- **Chức năng**: 
  - `getAllEmployers()` - Lấy tất cả employer profiles từ DynamoDB
  - `approveEmployer(userId)` - Duyệt nhà tuyển dụng
  - `rejectEmployer(userId, reason)` - Từ chối nhà tuyển dụng
  - `updateVerificationStatus(userId, isVerified)` - Cập nhật trạng thái xác minh

#### Cập nhật EmployersManagement Component
- **File**: `src/pages/admin/EmployersManagement.jsx`
- **Thay đổi**:
  - Thay thế import dữ liệu tĩnh bằng `adminEmployerService`
  - Thêm chức năng `loadEmployers()` để fetch từ API
  - Thêm nút "Refresh" để reload dữ liệu
  - Cập nhật `handleApprove()` để gọi API thực tế
  - Thêm error handling và loading states

### 2. Backend Changes

#### Cập nhật Employer Profile Service
- **File**: `amplify/backend/employer-profile.cjs`
- **Thêm methods mới**:
  - `listAllProfiles()` - Lấy tất cả profiles (không filter)
  - `updateApprovalStatus(userId, status, metadata)` - Cập nhật approval status
  - `updateVerificationStatus(userId, isVerified, metadata)` - Cập nhật verification status

#### Tạo Lambda Handler mới với Admin Routes
- **File**: `amplify/backend/api-employer-profile-admin.cjs`
- **Admin Endpoints**:
  - `GET /admin/employers` - List tất cả employers
  - `POST /admin/employers/{userId}/approve` - Approve employer
  - `POST /admin/employers/{userId}/reject` - Reject employer
  - `POST /admin/employers/{userId}/verify` - Update verification status
- **Security**: Kiểm tra user có trong Cognito group "Admin"

## Cách Deploy

### Bước 1: Deploy Lambda Function với Admin Support

```powershell
cd amplify/backend
./deploy-employer-api-with-admin.ps1
```

Script này sẽ:
1. Tạo deployment package với admin handler mới
2. Update Lambda function code
3. Giữ nguyên các routes hiện tại

### Bước 2: Cấu hình API Gateway Routes

Bạn có 2 lựa chọn:

#### Option A: Sử dụng AWS Console (Khuyến nghị)

1. Mở AWS Console: https://console.aws.amazon.com/apigateway
2. Chọn API: `EmployerProfileAPI` (ID: dlidp35x33)
3. Tạo resource `/admin`:
   - Click "Actions" → "Create Resource"
   - Resource Name: `admin`
   - Resource Path: `/admin`
4. Tạo resource `/admin/employers`:
   - Select `/admin` resource
   - Click "Actions" → "Create Resource"
   - Resource Name: `employers`
   - Resource Path: `/employers`
5. Thêm GET method cho `/admin/employers`:
   - Select `/admin/employers`
   - Click "Actions" → "Create Method" → "GET"
   - Integration type: Lambda Function
   - Lambda Function: `EmployerProfileFunction`
   - Use Lambda Proxy integration: ✓
6. Tạo resource `/admin/employers/{userId}`:
   - Select `/admin/employers`
   - Create Resource với path part: `{userId}`
7. Tạo resources cho actions:
   - `/admin/employers/{userId}/approve` (POST method)
   - `/admin/employers/{userId}/reject` (POST method)
   - `/admin/employers/{userId}/verify` (POST method)
8. Enable CORS cho tất cả resources
9. Deploy API:
   - Click "Actions" → "Deploy API"
   - Stage: `prod`

#### Option B: Sử dụng Script (Cần chỉnh sửa)

```powershell
# Cần cập nhật AUTHORIZER_ID trước
./add-admin-routes-to-api.ps1
```

### Bước 3: Cấu hình Cognito Admin Group

Đảm bảo user admin có trong Cognito group "Admin":

```powershell
aws cognito-idp admin-add-user-to-group `
    --user-pool-id YOUR_USER_POOL_ID `
    --username admin@example.com `
    --group-name Admin `
    --region ap-southeast-1
```

### Bước 4: Test API

```powershell
# Test GET all employers
curl -X GET https://dlidp35x33.execute-api.ap-southeast-1.amazonaws.com/prod/admin/employers `
  -H "Authorization: Bearer YOUR_TOKEN"

# Test approve employer
curl -X POST https://dlidp35x33.execute-api.ap-southeast-1.amazonaws.com/prod/admin/employers/USER_ID/approve `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{"approvedAt":"2024-01-01T00:00:00Z"}'
```

## Kiểm tra Frontend

1. Đăng nhập với tài khoản admin
2. Vào trang "Quản Lý Nhà Tuyển Dụng"
3. Kiểm tra:
   - Dữ liệu load từ DynamoDB
   - Nút "Làm mới" hoạt động
   - Nút "Duyệt" cập nhật được status
   - Stats hiển thị đúng

## Troubleshooting

### Lỗi 403 Forbidden
- Kiểm tra user có trong Cognito group "Admin"
- Kiểm tra token có chứa `cognito:groups` claim

### Lỗi 404 Not Found
- Kiểm tra API Gateway routes đã được tạo
- Kiểm tra API đã được deploy sang stage "prod"

### Lỗi CORS
- Enable CORS cho tất cả admin resources
- Đảm bảo OPTIONS method được cấu hình

### Không load được dữ liệu
- Kiểm tra console log trong browser
- Kiểm tra Lambda function logs:
  ```powershell
  aws logs tail /aws/lambda/EmployerProfileFunction --follow
  ```

## API Endpoints Summary

### User Endpoints (Existing)
- `GET /profile/{userId}` - Get profile
- `POST /profile` - Create profile
- `PUT /profile/{userId}` - Update profile
- `DELETE /profile/{userId}` - Delete profile

### Admin Endpoints (New)
- `GET /admin/employers` - List all employers
- `POST /admin/employers/{userId}/approve` - Approve employer
- `POST /admin/employers/{userId}/reject` - Reject employer
- `POST /admin/employers/{userId}/verify` - Update verification

## Environment Variables

Đảm bảo `.env` có:
```
VITE_EMPLOYER_API_URL=https://dlidp35x33.execute-api.ap-southeast-1.amazonaws.com/prod
```

## Next Steps

1. Deploy Lambda function
2. Cấu hình API Gateway routes
3. Test endpoints
4. Deploy frontend
5. Test end-to-end workflow

## Support

Nếu gặp vấn đề, kiểm tra:
- CloudWatch Logs cho Lambda function
- API Gateway execution logs
- Browser console logs
- Network tab trong DevTools
