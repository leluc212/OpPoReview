# ✅ CV Upload System - Hoàn Thành

## Tổng quan

Hệ thống upload CV đã được triển khai thành công với kiến trúc:

```
Ứng viên → Frontend → API Gateway → Lambda → S3 + DynamoDB
```

## Đã triển khai

### 1. Backend Infrastructure

✅ **S3 Bucket**: `opporeview-cv-storage`
- Private bucket (không public access)
- Versioning enabled
- CORS configured cho GitHub Pages và localhost

✅ **Lambda Function**: `CVUploadFunction`
- Runtime: Python 3.11
- Memory: 512 MB
- Timeout: 30s
- Permissions: S3 (read/write/delete) + DynamoDB (read/write)

✅ **API Gateway**: HTTP API
- API ID: `v56v542h8f`
- Endpoint: `https://v56v542h8f.execute-api.ap-southeast-1.amazonaws.com/prod`
- CORS: Configured for GitHub Pages + localhost:3000 + localhost:5173

### 2. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/cv/upload` | Upload CV file (PDF, DOC, DOCX) |
| GET | `/cv/{userId}` | Get CV info with presigned URL |
| DELETE | `/cv/{userId}` | Delete CV from S3 and DynamoDB |

### 3. Frontend Components

✅ **Service**: `src/services/cvUploadService.js`
- Upload CV với base64 encoding
- Get CV info
- Delete CV
- Download CV helper

✅ **Component**: `src/components/CVUpload.jsx`
- Drag & drop upload
- Progress bar
- File preview
- View/Download/Delete actions
- Error handling

✅ **Integration**: `src/pages/candidate/CandidateProfile.jsx`
- CV component đã được thêm vào Sidebar
- Thay thế mock CV section

### 4. DynamoDB Schema

Các field mới trong `CandidateProfiles` table:

```javascript
{
  userId: "296aa58c-30a1-70cc-44ed-b829e33a8245",
  cvUrl: "https://opporeview-cv-storage.s3.amazonaws.com/...", // Presigned URL (7 days)
  cvFileName: "CV_LeTanLuc.pdf",
  cvS3Key: "cvs/296aa58c.../20260313_123456_abc123_CV_LeTanLuc.pdf",
  cvUploadDate: "2026-03-13T12:34:56.789Z"
}
```

## Tính năng

✅ Upload CV (PDF, DOC, DOCX)
✅ Giới hạn file size 5MB
✅ Lưu trữ an toàn trên S3 (private bucket)
✅ Presigned URL tự động (valid 7 days)
✅ Xem CV trực tiếp trong browser
✅ Tải xuống CV
✅ Xóa CV
✅ Drag & drop upload
✅ Progress bar
✅ Error handling với messages tiếng Việt

## Test

### Test trên GitHub Pages
1. Vào: https://leluc213.github.io/OpPoReview/
2. Đăng nhập với tài khoản ứng viên
3. Vào "Hồ sơ của tôi"
4. Upload file CV (PDF, DOC, DOCX)
5. Kiểm tra: View, Download, Delete

### Test trên Localhost
1. Chạy: `npm run dev`
2. Mở: http://localhost:3000
3. Đăng nhập và test tương tự

### Test API trực tiếp
Mở file: `test-cv-upload.html` trong browser

## Troubleshooting

### Lỗi "Failed to fetch"
- Kiểm tra CORS configuration
- Kiểm tra Lambda function có chạy không
- Xem Lambda logs: `aws logs tail /aws/lambda/CVUploadFunction --follow`

### Lỗi "File too large"
- Giới hạn 5MB
- Nén file hoặc chuyển sang PDF

### Lỗi "Invalid file type"
- Chỉ chấp nhận: .pdf, .doc, .docx
- Kiểm tra file extension

### Presigned URL expired
- URL hết hạn sau 7 ngày
- Gọi `GET /cv/{userId}` để lấy URL mới

## Khi ứng viên ứng tuyển

Khi ứng viên click "Ứng tuyển" vào một công việc:

1. Frontend lấy `cvUrl` từ profile của ứng viên
2. Gửi application request với `cvUrl` đến API
3. NTD nhận được application với link download CV
4. NTD click vào link để xem/download CV

## Chi phí ước tính

Cho 1000 users, mỗi user 1 CV 2MB:

- **S3 Storage**: 2GB × $0.023/GB = $0.046/month
- **Lambda**: Free tier (1M requests/month)
- **API Gateway**: Free tier (1M requests/month)
- **Data Transfer**: Minimal (presigned URLs)

**Total: < $1/month** 💰

## Bảo mật

✅ S3 bucket private (không public access)
✅ Presigned URL có thời hạn (7 days)
✅ CORS chỉ cho phép domain cụ thể
✅ Lambda có quyền tối thiểu cần thiết
✅ File type validation
✅ File size validation (5MB max)
✅ User chỉ có thể upload/delete CV của chính mình

## Files quan trọng

### Backend
- `amplify/backend/cv-upload-lambda.py` - Lambda handler
- `create-cv-bucket.ps1` - Script tạo S3 bucket
- `create-cv-upload-api.ps1` - Script tạo API Gateway
- `create-cv-lambda-only.ps1` - Script tạo Lambda function

### Frontend
- `src/services/cvUploadService.js` - API client
- `src/components/CVUpload.jsx` - UI component
- `src/pages/candidate/CandidateProfile.jsx` - Integration

### Test
- `test-cv-upload.html` - Test API endpoints
- `test-cv-sample.txt` - Sample CV content

## Next Steps

Để tích hợp CV vào application flow:

1. Khi ứng viên ứng tuyển, lấy `cvUrl` từ profile
2. Gửi `cvUrl` cùng với application data
3. Lưu `cvUrl` vào Applications table
4. NTD có thể xem CV từ application

## Support

Nếu có vấn đề:
1. Kiểm tra Lambda logs
2. Kiểm tra S3 bucket permissions
3. Kiểm tra API Gateway CORS
4. Test với `test-cv-upload.html`

---

**Status**: ✅ Production Ready
**Deployed**: March 13, 2026
**Version**: 1.0.0
