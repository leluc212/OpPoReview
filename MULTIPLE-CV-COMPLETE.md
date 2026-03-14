# Multiple CV Feature - Implementation Complete ✅

## Tóm tắt

Đã hoàn thành việc implement tính năng upload và quản lý nhiều CV (tối đa 3 CV).

## ✅ Đã hoàn thành

### 1. Backend (Lambda + DynamoDB)
- ✅ **Lambda Function**: `cv-upload-lambda-v2.py` deployed
- ✅ **DynamoDB Schema**: Hỗ trợ `cvList` array
- ✅ **API Endpoints**:
  - `GET /cv/{userId}` - Trả về danh sách CV
  - `POST /cv/upload` - Upload CV mới (max 3)
  - `DELETE /cv/{userId}/{cvId}` - Xóa CV cụ thể
  - `DELETE /cv/{userId}` - Xóa tất cả CV (backward compatibility)

### 2. Frontend Service
- ✅ **cvUploadService.js**: Updated để hỗ trợ multiple CVs
  - `getCVInfo()` - Trả về `{ cvList: [], totalCVs: 0 }`
  - `deleteCV(userId, cvId)` - Xóa CV cụ thể
  - Backward compatible với old format

### 3. CVUpload Component
- ✅ Hiển thị danh sách tối đa 3 CV
- ✅ Upload thêm CV mới (nếu chưa đạt giới hạn)
- ✅ Xem/Xóa từng CV riêng lẻ
- ✅ Thông báo khi đã đạt giới hạn

### 4. JobListing Component
- ✅ Modal chọn CV khi ứng tuyển
- ✅ Hiển thị danh sách CV với radio buttons
- ✅ Gửi CV đã chọn khi ứng tuyển
- ✅ Disable nút "Gửi CV" nếu chưa chọn

## 🎯 Cách sử dụng

### Upload CV
1. Vào trang "Hồ sơ của tôi"
2. Phần "CV / Hồ Sơ" hiển thị số lượng CV hiện tại (0/3, 1/3, 2/3, 3/3)
3. Click hoặc kéo thả file để upload
4. Tối đa 3 CV, mỗi file tối đa 5MB

### Xóa CV
1. Click nút "Xóa" (🗑️) trên CV muốn xóa
2. Xác nhận xóa
3. CV sẽ bị xóa khỏi S3 và DynamoDB

### Ứng tuyển với CV
1. Tìm công việc và click "Gửi CV ngay"
2. Modal hiện ra với danh sách CV
3. Chọn 1 trong các CV (radio button)
4. Click "Gửi CV ngay" để gửi

## 📊 DynamoDB Schema

```json
{
  "userId": "xxx-xxx-xxx",
  "cvList": [
    {
      "id": "uuid-1",
      "cvUrl": "https://s3.presigned.url/...",
      "cvFileName": "CV_TanLuc.pdf",
      "cvS3Key": "cvs/userId/uuid-1_timestamp_CV_TanLuc.pdf",
      "cvUploadDate": "2026-03-14T10:00:00Z"
    },
    {
      "id": "uuid-2",
      "cvUrl": "https://s3.presigned.url/...",
      "cvFileName": "CV_English.pdf",
      "cvS3Key": "cvs/userId/uuid-2_timestamp_CV_English.pdf",
      "cvUploadDate": "2026-03-14T11:00:00Z"
    }
  ],
  "updatedAt": "2026-03-14T11:00:00Z"
}
```

## 🔄 API Response Format

### GET /cv/{userId}
```json
{
  "cvList": [
    {
      "id": "uuid-1",
      "cvUrl": "https://...",
      "cvFileName": "CV_TanLuc.pdf",
      "cvS3Key": "cvs/...",
      "cvUploadDate": "2026-03-14T10:00:00Z"
    }
  ],
  "totalCVs": 1
}
```

### POST /cv/upload
```json
{
  "message": "CV uploaded successfully",
  "cv": {
    "id": "uuid-1",
    "cvUrl": "https://...",
    "cvFileName": "CV_TanLuc.pdf",
    "cvS3Key": "cvs/...",
    "cvUploadDate": "2026-03-14T10:00:00Z"
  },
  "totalCVs": 1
}
```

### DELETE /cv/{userId}/{cvId}
```json
{
  "message": "CV deleted successfully",
  "deletedCV": {
    "id": "uuid-1",
    "cvFileName": "CV_TanLuc.pdf"
  },
  "remainingCVs": 2
}
```

## 🧪 Testing

### Test Upload
1. Upload 1 CV → Kiểm tra hiển thị trong danh sách
2. Upload thêm 2 CV nữa → Tổng 3 CV
3. Thử upload CV thứ 4 → Hiện thông báo giới hạn

### Test Delete
1. Xóa 1 CV → Kiểm tra còn 2 CV
2. Upload thêm 1 CV → Tổng 3 CV lại

### Test Apply
1. Click "Gửi CV ngay"
2. Modal hiện danh sách CV
3. Chọn CV → Radio button được chọn
4. Click "Gửi CV ngay" → Gửi thành công

## 🔧 Backward Compatibility

Code vẫn hỗ trợ old format (single CV):
- Nếu API trả về `{ cvUrl, cvFileName }` → Convert sang `{ cvList: [...] }`
- `deleteCV(userId)` vẫn hoạt động (xóa tất cả CV)

## 📝 Notes

- Presigned URLs có thời hạn 7 ngày
- URLs được refresh tự động khi gọi GET API
- S3 keys format: `cvs/{userId}/{cvId}_{timestamp}_{filename}`
- CV IDs là UUID để tránh conflict

## 🚀 Deployment

```powershell
# Deploy backend
./deploy-multiple-cv-backend.ps1

# Frontend đã được update tự động
# Chỉ cần refresh browser
```

## ✨ Features

- ✅ Upload tối đa 3 CV
- ✅ Xem/Xóa từng CV riêng
- ✅ Chọn CV khi ứng tuyển
- ✅ Presigned URLs tự động refresh
- ✅ Backward compatible
- ✅ Error handling đầy đủ
- ✅ Loading states
- ✅ Success/Error messages

Hoàn tất! 🎉
