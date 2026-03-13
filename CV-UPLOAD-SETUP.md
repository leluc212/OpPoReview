# CV Upload System Setup Guide

## Kiến trúc hệ thống

```
Ứng viên upload CV
    ↓
Frontend (React)
    ↓
API Gateway
    ↓
Lambda Function
    ↓
├─→ S3 (lưu file CV)
└─→ DynamoDB (lưu metadata: cvUrl, cvFileName, cvUploadDate)
```

## Bước 1: Tạo S3 Bucket

```powershell
.\create-cv-bucket.ps1
```

Bucket name: `opporeview-cv-storage`

## Bước 2: Deploy Lambda và API Gateway

```powershell
.\create-cv-upload-api.ps1
```

Script sẽ tạo:
- IAM Role với quyền truy cập S3 và DynamoDB
- Lambda function `CVUploadFunction`
- API Gateway với các endpoints:
  - `POST /cv/upload` - Upload CV
  - `GET /cv/{userId}` - Lấy thông tin CV
  - `DELETE /cv/{userId}` - Xóa CV

## Bước 3: Cập nhật API endpoint trong frontend

Sau khi chạy script, bạn sẽ nhận được API endpoint như:
```
https://abc123xyz.execute-api.ap-southeast-1.amazonaws.com/prod
```

Cập nhật trong `src/services/cvUploadService.js`:
```javascript
const API_BASE_URL = 'https://YOUR_API_ID.execute-api.ap-southeast-1.amazonaws.com/prod';
```

## Bước 4: Thêm CVUpload component vào CandidateProfile

Trong `src/pages/candidate/CandidateProfile.jsx`, import và sử dụng:

```javascript
import CVUpload from '../../components/CVUpload';

// Thêm vào JSX
<CVUpload />
```

## Bước 5: Test

1. Đăng nhập với tài khoản ứng viên
2. Vào trang "Hồ sơ của tôi"
3. Upload file CV (PDF, DOC, DOCX)
4. Kiểm tra:
   - File được upload lên S3
   - Metadata được lưu vào DynamoDB
   - Có thể xem, tải xuống, xóa CV

## API Endpoints

### 1. Upload CV
```
POST /cv/upload
Content-Type: application/json

{
  "userId": "296aa58c-30a1-70cc-44ed-b829e33a8245",
  "fileName": "CV_LeTanLuc.pdf",
  "fileContent": "base64_encoded_content",
  "fileType": "application/pdf"
}

Response:
{
  "message": "CV uploaded successfully",
  "cvUrl": "https://opporeview-cv-storage.s3.amazonaws.com/...",
  "cvFileName": "CV_LeTanLuc.pdf",
  "s3Key": "cvs/296aa58c.../20260313_123456_abc123_CV_LeTanLuc.pdf"
}
```

### 2. Get CV Info
```
GET /cv/{userId}

Response:
{
  "cvUrl": "https://opporeview-cv-storage.s3.amazonaws.com/...",
  "cvFileName": "CV_LeTanLuc.pdf",
  "cvUploadDate": "2026-03-13T12:34:56.789Z",
  "s3Key": "cvs/296aa58c.../20260313_123456_abc123_CV_LeTanLuc.pdf"
}
```

### 3. Delete CV
```
DELETE /cv/{userId}

Response:
{
  "message": "CV deleted successfully"
}
```

## DynamoDB Schema Update

Các field mới được thêm vào `CandidateProfiles` table:
- `cvUrl` (String) - Presigned URL để download CV (valid 7 days)
- `cvFileName` (String) - Tên file gốc
- `cvS3Key` (String) - S3 key để quản lý file
- `cvUploadDate` (String) - ISO timestamp

## Tính năng

✅ Upload CV (PDF, DOC, DOCX)
✅ Giới hạn file size 5MB
✅ Lưu trữ an toàn trên S3
✅ Presigned URL tự động refresh
✅ Xem CV trực tiếp
✅ Tải xuống CV
✅ Xóa CV
✅ Drag & drop upload
✅ Progress bar
✅ Error handling

## Bảo mật

- S3 bucket private (không public access)
- Presigned URL có thời hạn 7 ngày
- CORS chỉ cho phép domain cụ thể
- Lambda có quyền tối thiểu cần thiết
- File type validation
- File size validation

## Khi ứng viên ứng tuyển

Khi ứng viên click "Ứng tuyển", hệ thống sẽ:
1. Lấy `cvUrl` từ profile của ứng viên
2. Gửi application với `cvUrl` đến NTD
3. NTD có thể download CV từ presigned URL

## Troubleshooting

### Lỗi "Access Denied" khi upload
- Kiểm tra IAM role có quyền `s3:PutObject`
- Kiểm tra bucket policy

### Lỗi "URL expired"
- Presigned URL hết hạn sau 7 ngày
- Gọi `GET /cv/{userId}` để lấy URL mới

### Lỗi "File too large"
- Giới hạn 5MB
- Nén file hoặc chuyển sang PDF

## Chi phí ước tính

- S3 storage: ~$0.023/GB/month
- Lambda invocations: Free tier 1M requests/month
- API Gateway: Free tier 1M requests/month
- Data transfer: $0.09/GB (out to internet)

Ước tính cho 1000 users, mỗi user 1 CV 2MB:
- Storage: 2GB × $0.023 = $0.046/month
- Requests: Negligible (trong free tier)

**Total: < $1/month**
