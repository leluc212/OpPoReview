# 📥 Hướng dẫn tải CV

## Cách 1: Trong ứng dụng

1. Đăng nhập vào ứng dụng
2. Vào trang "Hồ sơ của tôi" (Candidate Profile)
3. Tìm phần "CV / Hồ Sơ"
4. Click nút **⬇️** (Download)

CV sẽ tự động tải về máy của bạn.

---

## Cách 2: Test trực tiếp

Mở file `test-cv-download.html` trong browser:

1. Nhập User ID của bạn
2. Click "Get CV Info"
3. Click "⬇️ Download CV"

---

## Nếu không tải được

### Thử 1: Click nút "👁️ View CV"
- CV sẽ mở trong tab mới
- Sau đó bạn có thể:
  - Click chuột phải → "Save as..."
  - Hoặc dùng Ctrl+S để lưu

### Thử 2: Refresh URL
- Click lại nút "Get CV Info" để lấy URL mới
- Presigned URL có thể đã hết hạn (7 ngày)

### Thử 3: Kiểm tra browser
- Cho phép download từ site
- Tắt popup blocker
- Kiểm tra thư mục Downloads

---

## Cách hoạt động

### Backend (Lambda)
Khi tạo presigned URL, Lambda thêm parameter:
```python
ResponseContentDisposition: 'attachment; filename="CV_file.pdf"'
```

Điều này báo cho browser tự động download thay vì mở file.

### Frontend (Service)
```javascript
const a = document.createElement('a');
a.href = cvUrl;           // Presigned URL
a.download = fileName;    // Tên file khi download
a.click();                // Trigger download
```

---

## Troubleshooting

### Lỗi: "Failed to fetch"
**Nguyên nhân**: CORS issue

**Giải pháp**: 
- Code đã được update để dùng direct link thay vì fetch
- Không cần fetch, chỉ cần click vào presigned URL

### Lỗi: "Popup blocked"
**Nguyên nhân**: Browser chặn popup

**Giải pháp**:
- Cho phép popup cho domain
- Hoặc dùng nút "View" rồi Save as

### File mở thay vì download
**Nguyên nhân**: Browser setting hoặc presigned URL không có Content-Disposition

**Giải pháp**:
1. Update Lambda (đã làm rồi)
2. Get CV Info lại để lấy URL mới
3. Hoặc dùng "View" rồi "Save as"

---

## Đã update

✅ Lambda function - Thêm `Content-Disposition: attachment`
✅ Frontend service - Dùng direct link thay vì fetch
✅ CVUpload component - Auto refresh URL trước khi download

---

## Test

Chạy test để verify:

```bash
# Mở test file
start test-cv-download.html

# Hoặc trong ứng dụng
npm run dev
# Vào Candidate Profile → CV section → Click Download
```

---

**Last Updated**: March 13, 2026
