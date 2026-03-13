# ✅ CV Vietnamese Filename Fix

## Vấn đề

Khi upload CV có tên file tiếng Việt (ví dụ: `CV_Bá_Hoàng_Hiếu.pdf`), gặp lỗi:

```
Parameter validation failed: Non ascii characters found in S3 metadata 
for key "originalFileName"
```

**Nguyên nhân**: S3 metadata chỉ chấp nhận ký tự ASCII, không hỗ trợ Unicode/tiếng Việt.

---

## Giải pháp

### 1. Backend Fix (Lambda)

**File**: `amplify/backend/cv-upload-lambda.py`

Thay đổi:
- Chuyển filename sang ASCII-safe format cho metadata
- Dùng `ContentDisposition` để giữ tên file gốc khi download
- Normalize Unicode characters

```python
import unicodedata

# Convert filename to ASCII-safe format
safe_filename = unicodedata.normalize('NFKD', file_name).encode('ascii', 'ignore').decode('ascii')

s3_client.put_object(
    Bucket=BUCKET_NAME,
    Key=s3_key,
    Body=file_data,
    ContentType=file_type,
    ContentDisposition=f'inline; filename="{file_name}"',  # Original name
    Metadata={
        'userId': user_id,
        'originalFileName': safe_filename,  # ASCII-safe version
        'uploadDate': datetime.now().isoformat()
    }
)
```

### 2. Frontend Fix (Service)

**File**: `src/services/cvUploadService.js`

Thêm function sanitize filename:

```javascript
const sanitizeFilename = (filename) => {
  const lastDot = filename.lastIndexOf('.');
  const name = lastDot > 0 ? filename.substring(0, lastDot) : filename;
  const ext = lastDot > 0 ? filename.substring(lastDot) : '';
  
  let safeName = name
    .normalize('NFD') // Decompose Vietnamese characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd').replace(/Đ/g, 'D') // Handle đ/Đ
    .replace(/[^a-zA-Z0-9\s_-]/g, '_') // Replace special chars
    .replace(/\s+/g, '_') // Replace spaces
    .replace(/_+/g, '_') // Remove duplicate underscores
    .substring(0, 100); // Limit length
  
  return safeName + ext;
};
```

**Ví dụ chuyển đổi**:
- `CV_Bá_Hoàng_Hiếu.pdf` → `CV_Ba_Hoang_Hieu.pdf`
- `Hồ sơ xin việc - Nguyễn Văn A.docx` → `Ho_so_xin_viec_Nguyen_Van_A.docx`
- `CV-Lê-Tấn-Lực-2026.pdf` → `CV-Le-Tan-Luc-2026.pdf`

---

## Deployment

### Update Lambda Function

```powershell
.\update-cv-lambda.ps1
```

Script sẽ:
1. Tạo zip file từ `cv-upload-lambda.py`
2. Update Lambda function trên AWS
3. Verify deployment

### Frontend

Code đã được update trong `src/services/cvUploadService.js`. 

Rebuild và deploy:
```bash
npm run build
# Deploy to GitHub Pages or your hosting
```

---

## Testing

### Test 1: Filename Sanitization

Mở `test-vietnamese-filename.html` để xem các tên file được chuyển đổi như thế nào.

### Test 2: Upload CV

1. Mở `test-vietnamese-filename.html`
2. Chọn file CV có tên tiếng Việt
3. Click "Upload CV"
4. Kiểm tra kết quả

### Test 3: Trong ứng dụng

1. Đăng nhập vào ứng dụng
2. Vào trang Candidate Profile
3. Upload CV có tên tiếng Việt
4. Verify: Upload thành công, có thể xem/download

---

## Kết quả

✅ Upload CV với tên tiếng Việt thành công
✅ Tên file được sanitize tự động
✅ Vẫn giữ được tên gốc khi download (qua ContentDisposition)
✅ Không còn lỗi S3 metadata validation
✅ Tương thích với mọi ký tự đặc biệt

---

## Files đã thay đổi

1. `amplify/backend/cv-upload-lambda.py` - Backend fix
2. `src/services/cvUploadService.js` - Frontend sanitization
3. `update-cv-lambda.ps1` - Deployment script
4. `test-vietnamese-filename.html` - Test tool

---

## Lưu ý

- Tên file sẽ được chuyển đổi tự động (ví dụ: `Hoàng` → `Hoang`)
- Tên file gốc vẫn được giữ trong `ContentDisposition` header
- Khi download, browser có thể hiển thị tên gốc hoặc tên đã sanitize (tùy browser)
- S3 key vẫn dùng tên đã sanitize để tránh vấn đề URL encoding

---

**Status**: ✅ Fixed and Deployed
**Date**: March 13, 2026
**Version**: 1.1.0
