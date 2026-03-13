# 🔧 CV Upload Troubleshooting Guide

## Vấn đề: Không mở được CV sau khi upload

### Các nguyên nhân có thể:

1. **Presigned URL đã hết hạn** (7 ngày)
2. **CORS configuration chưa đúng**
3. **S3 bucket permissions**
4. **Browser popup bị chặn**

---

## Bước 1: Kiểm tra CV Info

Mở file `test-cv-view.html` trong browser:

1. Nhập User ID
2. Click "Get CV Info"
3. Kiểm tra response:
   - `cvUrl`: Phải có giá trị
   - `cvFileName`: Tên file CV
   - `cvUploadDate`: Ngày upload

**Nếu không có cvUrl**: CV chưa được upload hoặc đã bị xóa.

---

## Bước 2: Test CV URL

Trong `test-cv-view.html`:

1. CV URL sẽ tự động điền từ bước 1
2. Click "Test URL"
3. Xem kết quả:

### ✅ Nếu thành công:
```
✅ URL is valid!
Status: 200
Headers: {...}
```
→ URL hoạt động, có thể click "Open CV" để xem

### ❌ Nếu lỗi CORS:
```
❌ Error: Failed to fetch
This might be a CORS issue...
```
→ Chạy script fix CORS (xem Bước 3)

### ❌ Nếu lỗi 403 Forbidden:
```
❌ URL failed!
Status: 403
```
→ URL đã hết hạn hoặc không có quyền truy cập

---

## Bước 3: Fix CORS Configuration

Chạy PowerShell script:

```powershell
# Kiểm tra CORS hiện tại
.\check-cv-bucket.ps1

# Fix CORS nếu cần
.\fix-cv-bucket-cors.ps1
```

CORS configuration đúng phải có:
- AllowedOrigins: GitHub Pages + localhost
- AllowedMethods: GET, PUT, POST, DELETE, HEAD
- AllowedHeaders: *

---

## Bước 4: Refresh Presigned URL

Nếu URL đã hết hạn (sau 7 ngày):

### Cách 1: Trong ứng dụng
1. Click nút "Xem CV" (👁️)
2. Component sẽ tự động refresh URL trước khi mở

### Cách 2: Gọi API trực tiếp
```javascript
// GET /cv/{userId} sẽ tự động tạo presigned URL mới
const response = await fetch(
  'https://v56v542h8f.execute-api.ap-southeast-1.amazonaws.com/prod/cv/USER_ID'
);
const data = await response.json();
console.log(data.cvUrl); // URL mới
```

---

## Bước 5: Kiểm tra Lambda Logs

Nếu vẫn không hoạt động, xem Lambda logs:

```powershell
# Xem logs real-time
aws logs tail /aws/lambda/CVUploadFunction --follow

# Hoặc xem logs gần đây
aws logs tail /aws/lambda/CVUploadFunction --since 1h
```

Tìm các lỗi:
- S3 access denied
- Invalid bucket name
- Presigned URL generation failed

---

## Bước 6: Test với Sample CV

Upload một CV mẫu để test:

1. Tạo file PDF đơn giản
2. Upload qua ứng dụng
3. Kiểm tra trong S3:

```powershell
aws s3 ls s3://opporeview-cv-storage/cvs/ --recursive
```

4. Thử download trực tiếp:

```powershell
aws s3 cp s3://opporeview-cv-storage/cvs/USER_ID/FILE_NAME.pdf ./test-download.pdf
```

---

## Các lỗi thường gặp

### 1. "Popup blocked"
**Nguyên nhân**: Browser chặn popup

**Giải pháp**:
- Cho phép popup cho domain
- Hoặc dùng nút "Download" thay vì "View"

### 2. "Failed to fetch"
**Nguyên nhân**: CORS issue

**Giải pháp**:
```powershell
.\fix-cv-bucket-cors.ps1
```

### 3. "403 Forbidden"
**Nguyên nhân**: URL hết hạn hoặc không có quyền

**Giải pháp**:
- Click "Xem CV" lại (sẽ tự refresh URL)
- Hoặc gọi GET /cv/{userId} để lấy URL mới

### 4. "File not found"
**Nguyên nhân**: File đã bị xóa khỏi S3

**Giải pháp**:
- Upload lại CV
- Kiểm tra S3 bucket:
```powershell
aws s3 ls s3://opporeview-cv-storage/cvs/USER_ID/
```

### 5. "Invalid file type"
**Nguyên nhân**: File không phải PDF/DOC/DOCX

**Giải pháo**:
- Chỉ upload file: .pdf, .doc, .docx
- Kiểm tra file extension

---

## Code đã được cập nhật

### CVUpload.jsx

Đã thêm auto-refresh URL trước khi xem/download:

```javascript
const handleView = async () => {
  // Refresh URL trước khi xem
  const refreshedInfo = await getCVInfo(user.userId);
  setCvInfo(refreshedInfo);
  
  // Mở CV với URL mới
  window.open(refreshedInfo.cvUrl, '_blank');
};
```

### Lambda Function

Lambda tự động tạo presigned URL mới mỗi khi gọi GET /cv/{userId}:

```python
# Generate new presigned URL (valid 7 days)
new_url = s3_client.generate_presigned_url(
    'get_object',
    Params={'Bucket': BUCKET_NAME, 'Key': s3_key},
    ExpiresIn=604800  # 7 days
)
```

---

## Checklist

Trước khi báo lỗi, hãy kiểm tra:

- [ ] CV đã được upload thành công
- [ ] User ID đúng
- [ ] CORS configuration đã được apply
- [ ] Lambda function đang chạy
- [ ] S3 bucket tồn tại và có quyền truy cập
- [ ] Browser không chặn popup
- [ ] URL chưa hết hạn (hoặc đã được refresh)

---

## Support

Nếu vẫn gặp vấn đề:

1. Chạy `check-cv-bucket.ps1` và gửi output
2. Chạy `test-cv-view.html` và chụp màn hình
3. Xem Lambda logs và gửi error messages
4. Kiểm tra browser console (F12) để xem lỗi JavaScript

---

**Last Updated**: March 13, 2026
