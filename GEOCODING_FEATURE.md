# Tính năng Geocoding - Chuyển đổi địa chỉ thành GPS

## ✨ Tính năng mới

Hệ thống đã được tích hợp **Google Maps Geocoding API** để tự động chuyển đổi địa chỉ cụ thể thành tọa độ GPS.

### 🎯 Lợi ích

**Trước khi có tính năng này:**
- Nhà tuyển dụng phải nhập địa chỉ dạng "Quận 1, TP.HCM"
- Phải tự tìm và nhập tọa độ GPS thủ công
- Ứng viên khó tìm được công việc gần chính xác

**Sau khi có tính năng này:**
- Nhập địa chỉ cụ thể: "số 47 đường 5B, Long Bình, Thủ Đức"
- Tự động chuyển đổi thành tọa độ GPS
- Ứng viên tìm được công việc trong bán kính 3km chính xác
- Gợi ý địa chỉ khi nhập (autocomplete)

## 🚀 Cách sử dụng

### 1. Cấu hình API Key (một lần duy nhất)

```bash
# 1. Copy file cấu hình
cp .env.example .env

# 2. Thêm Google Maps API key vào .env
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here

# 3. Restart ứng dụng
npm start
```

### 2. Đăng bài tuyển dụng

1. Vào trang đăng bài tuyển dụng
2. Nhập địa chỉ cụ thể trong trường "Địa điểm làm việc":
   ```
   số 47 đường 5B, Long Bình, Thủ Đức
   123 Nguyễn Văn Linh, Quận 7, TP.HCM
   456 Lê Văn Việt, Quận 9, TP.HCM
   ```
3. Chọn từ danh sách gợi ý
4. Tọa độ GPS sẽ được tự động điền

### 3. Tìm kiếm công việc

Ứng viên bật "Tìm việc gần tôi" sẽ thấy:
- Công việc trong bán kính 3km chính xác
- Khoảng cách thực tế đến nơi làm việc
- Sắp xếp theo độ gần

## 📋 Hướng dẫn tạo Google Maps API Key

### Bước 1: Tạo project
1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới: "oppo-job-platform"

### Bước 2: Bật API
- Geocoding API
- Places API (New)

### Bước 3: Tạo API Key
1. Vào "Credentials" → "Create API Key"
2. Copy API key
3. Cấu hình restrictions cho bảo mật

### Bước 4: Thêm vào .env
```env
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyC...your_key_here
```

## 💰 Chi phí

- **Miễn phí**: 40,000 geocoding requests/tháng
- **Ước tính**: Miễn phí cho hầu hết ứng dụng nhỏ và vừa
- **Chi tiết**: Xem file `GOOGLE_MAPS_SETUP.md`

## 🔧 Files đã thay đổi

### Files mới:
- `src/services/geocodingService.js` - Service xử lý geocoding
- `src/components/AddressInput.jsx` - Component input địa chỉ với autocomplete
- `GOOGLE_MAPS_SETUP.md` - Hướng dẫn chi tiết
- `.env.example` - Template cấu hình

### Files đã cập nhật:
- `src/pages/employer/PostQuickJob.jsx` - Sử dụng AddressInput
- `src/pages/employer/EmployerProfile.jsx` - Sử dụng AddressInput

## 🧪 Test tính năng

### Với API Key:
1. Nhập: "số 47 đường 5B, Long Bình, Thủ Đức"
2. Thấy gợi ý địa chỉ
3. Chọn địa chỉ → tọa độ GPS hiển thị
4. Thông báo "Đã lấy tọa độ GPS thành công"

### Không có API Key:
- Vẫn hoạt động bình thường
- Hiển thị thông báo "Google Maps API chưa được cấu hình"
- Có thể nhập tọa độ thủ công như trước

## 🔒 Bảo mật

- API key được lưu trong `.env` (không commit vào git)
- Cấu hình domain restrictions
- Giới hạn chỉ các API cần thiết
- Debouncing để giảm số requests

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra console logs
2. Xem file `GOOGLE_MAPS_SETUP.md` để troubleshooting
3. Kiểm tra API key và permissions trong Google Cloud Console