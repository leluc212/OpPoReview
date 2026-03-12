# Hướng Dẫn Xóa Dữ Liệu Test

## ✅ Bước 1: Xóa Dữ Liệu Trong DynamoDB (Đã Hoàn Thành)

Bảng DynamoDB đã được xóa sạch.

## 🔄 Bước 2: Xóa Dữ Liệu Trong Browser

### Cách 1: Xóa Thủ Công (Khuyến Nghị)

1. Mở ứng dụng trong browser: http://localhost:3000/OpPoReview/
2. Nhấn F12 để mở DevTools
3. Chọn tab "Application" (hoặc "Ứng dụng")
4. Trong sidebar bên trái, tìm "Local Storage"
5. Click vào "http://localhost:3000"
6. Xóa các key sau:
   - `employerProfile`
   - `companyLogo`
   - `companyDocuments`
   - `companyVerificationData`

7. Hoặc đơn giản hơn, click chuột phải vào "http://localhost:3000" và chọn "Clear"

### Cách 2: Dùng Console

1. Mở ứng dụng trong browser
2. Nhấn F12 để mở DevTools
3. Chọn tab "Console"
4. Paste và chạy lệnh sau:

```javascript
// Xóa tất cả dữ liệu employer profile
localStorage.removeItem('employerProfile');
localStorage.removeItem('companyLogo');
localStorage.removeItem('companyDocuments');
localStorage.removeItem('companyVerificationData');
console.log('✅ Đã xóa tất cả dữ liệu employer profile');
```

### Cách 3: Xóa Toàn Bộ LocalStorage

```javascript
// Xóa tất cả localStorage (cẩn thận: sẽ xóa cả dữ liệu đăng nhập)
localStorage.clear();
console.log('✅ Đã xóa toàn bộ localStorage');
```

## 🔄 Bước 3: Refresh Trang

1. Sau khi xóa localStorage, nhấn F5 hoặc Ctrl+R để refresh trang
2. Trang "Hồ sơ công ty" sẽ hiển thị các trường trống
3. Bạn có thể bắt đầu điền thông tin mới

## ✅ Kiểm Tra

Sau khi xóa dữ liệu, bạn sẽ thấy:

- ✅ Tất cả các trường input đều trống
- ✅ Logo công ty hiển thị icon mặc định
- ✅ Không có dữ liệu cũ hiển thị
- ✅ Console log: "ℹ️ No employer profile found in DynamoDB - this is normal for new users"

## 🎯 Bước Tiếp Theo

Sau khi xóa dữ liệu, bạn có thể:

1. Điền thông tin công ty mới
2. Click "Lưu" để test API
3. Kiểm tra console logs
4. Verify dữ liệu được lưu vào DynamoDB

---

**Lưu ý:** Nếu bạn muốn giữ session đăng nhập, chỉ xóa các key liên quan đến employer profile, không xóa toàn bộ localStorage.
