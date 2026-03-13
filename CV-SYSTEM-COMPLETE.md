# ✅ CV System - Hoàn thiện

## Tổng quan

Hệ thống CV đã được hoàn thiện với đầy đủ tính năng:
- ✅ Upload CV (PDF, DOC, DOCX)
- ✅ Xem CV (Preview modal)
- ✅ Tải xuống CV
- ✅ Xóa CV
- ✅ Hỗ trợ tên file tiếng Việt
- ✅ Auto-refresh presigned URL

## Kiến trúc

```
Frontend (React) → API Gateway → Lambda → S3 + DynamoDB
```

### Backend
- **S3 Bucket**: `opporeview-cv-storage` (private)
- **Lambda**: `CVUploadFunction` (Python 3.11)
- **API Gateway**: HTTP API
- **DynamoDB**: `CandidateProfiles` table

### Frontend
- **Component**: `CVUpload.jsx` - Main UI
- **Modal**: `CVPreviewModal.jsx` - Preview CV
- **Service**: `cvUploadService.js` - API calls

## Tính năng chính

### 1. Upload CV
- Drag & drop hoặc click để chọn file
- Validate: PDF, DOC, DOCX (max 5MB)
- Sanitize filename (tiếng Việt → ASCII)
- Progress bar
- Auto-save to S3 + DynamoDB

### 2. Xem CV
- Click nút 👁️ để xem
- Mở modal preview với iframe
- Fallback: Download nếu không xem được
- Auto-refresh URL trước khi xem

### 3. Tải xuống CV
- Click nút ⬇️ để download
- Presigned URL với Content-Disposition: attachment
- Auto-refresh URL trước khi download
- Fallback: Mở tab mới nếu download fail

### 4. Xóa CV
- Click nút 🗑️ để xóa
- Confirm dialog
- Xóa từ S3 và DynamoDB


## Các vấn đề đã fix

### 1. Tên file tiếng Việt
**Vấn đề**: S3 metadata không chấp nhận Unicode
**Giải pháp**: 
- Sanitize filename ở frontend
- Normalize Unicode ở backend
- Dùng ContentDisposition để giữ tên gốc

### 2. Không tải được CV
**Vấn đề**: CORS issue khi fetch presigned URL
**Giải pháp**:
- Dùng direct link thay vì fetch
- Thêm Content-Disposition: attachment
- Auto-refresh URL trước khi download

### 3. URL hết hạn
**Vấn đề**: Presigned URL hết hạn sau 7 ngày
**Giải pháp**:
- Auto-refresh URL khi xem/download
- Lambda tự động tạo URL mới khi GET

## Files quan trọng

### Backend
- `amplify/backend/cv-upload-lambda.py` - Lambda handler
- `update-cv-lambda.ps1` - Deploy script

### Frontend
- `src/components/CVUpload.jsx` - Main component
- `src/components/CVPreviewModal.jsx` - Preview modal
- `src/services/cvUploadService.js` - API service

### Testing
- `test-cv-download.html` - Test download
- `test-cv-view.html` - Test view
- `test-vietnamese-filename.html` - Test filename

### Documentation
- `CV-UPLOAD-COMPLETE.md` - Setup guide
- `CV-TROUBLESHOOTING.md` - Troubleshooting
- `CV-DOWNLOAD-GUIDE.md` - Download guide
- `CV-VIETNAMESE-FILENAME-FIX.md` - Filename fix

## Sử dụng

### Trong ứng dụng
1. Đăng nhập với tài khoản ứng viên
2. Vào "Hồ sơ của tôi"
3. Tìm phần "CV / Hồ Sơ"
4. Upload, xem, download, hoặc xóa CV

### Test trực tiếp
```bash
# Test download
start test-cv-download.html

# Test view
start test-cv-view.html

# Test Vietnamese filename
start test-vietnamese-filename.html
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/cv/upload` | Upload CV |
| GET | `/cv/{userId}` | Get CV info + refresh URL |
| DELETE | `/cv/{userId}` | Delete CV |

## Bảo mật

✅ S3 bucket private
✅ Presigned URL có thời hạn (7 ngày)
✅ CORS chỉ cho domain cụ thể
✅ File type validation
✅ File size validation (5MB)
✅ User chỉ truy cập CV của mình

## Chi phí

Cho 1000 users, mỗi user 1 CV 2MB:
- S3 Storage: ~$0.05/month
- Lambda: Free tier
- API Gateway: Free tier
- **Total: < $1/month**

## Next Steps

Để tích hợp vào application flow:
1. Khi ứng viên ứng tuyển, lấy `cvUrl` từ profile
2. Gửi `cvUrl` trong application data
3. NTD xem CV từ application

---

**Status**: ✅ Production Ready
**Version**: 2.0.0
**Last Updated**: March 13, 2026
