# Hướng dẫn restart server để fix CORS

## Đã thực hiện

1. ✅ Thêm Vite proxy vào `vite.config.js` để bypass CORS trong development
2. ✅ Cập nhật `candidateProfileService.js` để sử dụng proxy

## Cách restart server

### Bước 1: Stop server hiện tại
Trong terminal đang chạy `npm run dev`, nhấn `Ctrl + C`

### Bước 2: Start lại server
```bash
npm run dev
```

### Bước 3: Refresh browser
- Mở lại http://localhost:3000/OpPoReview/candidate/profile
- Hard refresh: `Ctrl + Shift + R` hoặc `Ctrl + F5`

## Cách hoạt động

**Development (localhost):**
- Frontend gọi: `http://localhost:3000/api/profile/...`
- Vite proxy chuyển đến: `https://xyp4wkszi7.execute-api.ap-southeast-1.amazonaws.com/prod/profile/...`
- Không có CORS vì request đi từ server-side proxy

**Production (deployed):**
- Frontend gọi trực tiếp: `https://xyp4wkszi7.execute-api.ap-southeast-1.amazonaws.com/prod/profile/...`
- CORS đã được cấu hình trên API Gateway

## Kiểm tra

Sau khi restart, mở Developer Tools (F12) và kiểm tra:

1. **Console tab**: Không còn lỗi CORS
2. **Network tab**: 
   - Request đến `/api/profile/...` (không phải https://...)
   - Status code: 200 hoặc 404 (không phải CORS error)

## Nếu vẫn lỗi

Hãy chụp màn hình:
1. Console tab
2. Network tab (filter: Fetch/XHR)
3. Gửi cho tôi để debug tiếp
