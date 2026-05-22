# Hướng dẫn Refresh để thấy thay đổi

## Vấn đề
Trang vẫn hiển thị "7 giờ trước" thay vì sử dụng RelativeTime component động.

## Giải pháp

### 1. Hard Refresh Browser (Khuyến nghị)
- **Chrome/Edge**: `Ctrl + Shift + R` hoặc `Ctrl + F5`
- **Firefox**: `Ctrl + Shift + R`
- Hoặc: Mở DevTools (F12) → Right-click nút Refresh → "Empty Cache and Hard Reload"

### 2. Clear Browser Cache
1. Mở DevTools (F12)
2. Vào tab **Application** (Chrome) hoặc **Storage** (Firefox)
3. Click "Clear site data" hoặc xóa cache cho localhost:3000

### 3. Restart Dev Server
```bash
# Dừng server hiện tại (Ctrl + C)
# Sau đó chạy lại:
npm start
```

### 4. Kiểm tra Console
Mở DevTools Console (F12) và xem có lỗi nào không:
- Lỗi import RelativeTime component
- Lỗi timestamp format
- Lỗi API response

## Xác nhận thay đổi đã áp dụng

Tất cả các file sau đã được cập nhật để sử dụng RelativeTime:

✅ `src/components/NotificationsSidebar.jsx`
✅ `src/pages/employer/EmployerNotifications.jsx`
✅ `src/pages/admin/AdminNotifications.jsx`
✅ `src/pages/candidate/CandidateNotifications.jsx`

Tất cả đều sử dụng:
```jsx
<RelativeTime timestamp={notification.createdAt} language={language} />
```

Thay vì hardcoded strings như "7 giờ trước".

## Nếu vẫn không hoạt động

Kiểm tra file `src/components/RelativeTime.jsx` có tồn tại và hoạt động đúng không:
```bash
# Kiểm tra file tồn tại
dir src\components\RelativeTime.jsx
```

Nếu file không tồn tại, cần tạo lại component này.
