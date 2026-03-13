# 🔧 Fix CV Viewing CORS Error

## Vấn đề
Khi click "Xem CV", browser hiển thị lỗi CORS:
```
Access to script at 'https://unpkg.com/pdfjs-dist@...' has been blocked by CORS policy
Access to fetch at 'https://opporeview-cv-storage.s3.amazonaws.com/...' has been blocked by CORS policy
```

## Nguyên nhân
S3 bucket `opporeview-cv-storage` chưa được cấu hình CORS để cho phép browser truy cập trực tiếp vào file.

## Giải pháp

### Bước 1: Cấu hình CORS cho S3 Bucket

Chạy script PowerShell:
```powershell
.\fix-s3-cors.ps1
```

Script này sẽ:
1. Tạo CORS configuration cho bucket
2. Apply configuration lên S3
3. Verify configuration đã được áp dụng

**CORS Configuration:**
```json
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "HEAD"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": [
                "ETag",
                "Content-Type",
                "Content-Length",
                "Content-Disposition"
            ],
            "MaxAgeSeconds": 3000
        }
    ]
}
```

### Bước 2: Verify CORS Configuration

Kiểm tra CORS đã được apply:
```powershell
aws s3api get-bucket-cors --bucket opporeview-cv-storage
```

Expected output:
```json
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "HEAD"],
            "AllowedOrigins": ["*"],
            ...
        }
    ]
}
```

### Bước 3: Test CV Viewing

1. Refresh trang web
2. Click "Xem CV" (👁️ icon)
3. CV modal sẽ mở và hiển thị PDF

## Thay đổi Code

### CVPreviewModal.jsx
**Cải tiến:**
1. Fetch PDF qua JavaScript với proper CORS headers
2. Convert blob to data URL để tránh CORS issues
3. Better error handling với fallback download option

**Key changes:**
```javascript
// Fetch PDF with CORS handling
const response = await fetch(cvUrl, {
  method: 'GET',
  mode: 'cors',
  credentials: 'omit',
  headers: {
    'Accept': 'application/pdf'
  }
});

const blob = await response.blob();

// Convert to data URL for react-pdf
const reader = new FileReader();
reader.onloadend = () => {
  setPdfData(reader.result);
};
reader.readAsDataURL(blob);
```

## Troubleshooting

### Vẫn gặp lỗi CORS sau khi apply config?

1. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete → Clear cached images and files
   - Firefox: Ctrl+Shift+Delete → Cached Web Content

2. **Check S3 bucket policy:**
```powershell
aws s3api get-bucket-policy --bucket opporeview-cv-storage
```

Bucket policy nên allow GetObject:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::opporeview-cv-storage/*"
    }
  ]
}
```

3. **Verify presigned URL:**
```javascript
// In browser console
console.log('CV URL:', cvUrl);
// Should be: https://opporeview-cv-storage.s3.ap-southeast-1.amazonaws.com/cvs/...
```

4. **Test direct access:**
   - Copy presigned URL
   - Open in new browser tab
   - Should download/display PDF

### PDF.js worker errors?

Nếu thấy lỗi về PDF.js worker:
```
Setting up fake worker: react-pdf.js?v=...
```

Đây là warning bình thường, không ảnh hưởng chức năng.

### File không phải PDF?

Modal sẽ hiển thị:
```
📄 File này không phải PDF. Vui lòng tải xuống để xem.
[Tải xuống CV button]
```

User có thể click "Tải xuống CV" để download file DOC/DOCX.

## Alternative: Manual CORS Configuration

Nếu không thể chạy script, cấu hình thủ công qua AWS Console:

1. Mở [S3 Console](https://s3.console.aws.amazon.com/)
2. Chọn bucket `opporeview-cv-storage`
3. Tab "Permissions" → "Cross-origin resource sharing (CORS)"
4. Click "Edit" và paste:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": [
            "ETag",
            "Content-Type",
            "Content-Length",
            "Content-Disposition"
        ],
        "MaxAgeSeconds": 3000
    }
]
```

5. Click "Save changes"

## Security Notes

**Current CORS config allows all origins (`*`):**
- ✅ Good for development
- ⚠️ For production, restrict to your domain:

```json
"AllowedOrigins": [
    "https://yourdomain.com",
    "https://www.yourdomain.com"
]
```

**Presigned URLs:**
- Valid for 7 days (604800 seconds)
- Automatically refreshed when user views CV
- No authentication required (URL contains signature)

## Testing Checklist

- [ ] Run `fix-s3-cors.ps1` script
- [ ] Verify CORS config with `aws s3api get-bucket-cors`
- [ ] Clear browser cache
- [ ] Upload a test CV
- [ ] Click "Xem CV" (👁️)
- [ ] PDF displays in modal
- [ ] Zoom in/out works
- [ ] Page navigation works (multi-page PDFs)
- [ ] Download button works
- [ ] Close modal works

## Files Changed

- ✅ `src/components/CVPreviewModal.jsx` - Better CORS handling
- ✅ `fix-s3-cors.ps1` - S3 CORS configuration script (NEW)
- ✅ `FIX-CV-VIEW-CORS.md` - Documentation (NEW)

## Next Steps

1. Run the CORS fix script
2. Test CV viewing
3. If production, update CORS to restrict origins
4. Monitor CloudWatch logs for any S3 access issues
