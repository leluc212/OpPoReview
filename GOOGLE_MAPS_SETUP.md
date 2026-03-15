# Hướng dẫn cấu hình Google Maps API

## Tổng quan

Để sử dụng tính năng tự động chuyển đổi địa chỉ thành tọa độ GPS (geocoding), bạn cần cấu hình Google Maps API. Tính năng này cho phép:

- Nhập địa chỉ cụ thể như "số 47 đường 5B, Long Bình, Thủ Đức"
- Tự động chuyển đổi thành tọa độ GPS (latitude, longitude)
- Gợi ý địa chỉ khi người dùng nhập (autocomplete)
- Ứng viên có thể tìm được công việc trong bán kính 3km chính xác

## Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Đăng nhập bằng tài khoản Google
3. Tạo project mới:
   - Click "Select a project" → "New Project"
   - Nhập tên project: `oppo-job-platform`
   - Click "Create"

## Bước 2: Bật các API cần thiết

Trong Google Cloud Console, bật các API sau:

### 2.1 Geocoding API
- Vào "APIs & Services" → "Library"
- Tìm "Geocoding API"
- Click "Enable"

### 2.2 Places API (New)
- Tìm "Places API (New)"
- Click "Enable"

### 2.3 Maps JavaScript API (tùy chọn)
- Tìm "Maps JavaScript API"
- Click "Enable" (nếu muốn hiển thị bản đồ)

## Bước 3: Tạo API Key

1. Vào "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy API key được tạo
4. Click "Restrict Key" để cấu hình bảo mật

## Bước 4: Cấu hình bảo mật API Key

### 4.1 Application restrictions
- Chọn "HTTP referrers (web sites)"
- Thêm domain của bạn:
  ```
  http://localhost:3000/*
  https://yourdomain.com/*
  ```

### 4.2 API restrictions
- Chọn "Restrict key"
- Chọn các API:
  - Geocoding API
  - Places API (New)
  - Maps JavaScript API (nếu đã bật)

## Bước 5: Cấu hình trong ứng dụng

### 5.1 Tạo file .env
```bash
# Copy từ .env.example
cp .env.example .env
```

### 5.2 Thêm API key vào .env
```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 5.3 Restart ứng dụng
```bash
npm start
```

## Bước 6: Kiểm tra hoạt động

1. Vào trang đăng bài tuyển dụng
2. Nhập địa chỉ cụ thể: "số 47 đường 5B, Long Bình, Thủ Đức"
3. Kiểm tra:
   - Có gợi ý địa chỉ xuất hiện
   - Tọa độ GPS được hiển thị sau khi chọn
   - Thông báo "Đã lấy tọa độ GPS thành công"

## Chi phí sử dụng

### Geocoding API
- **Miễn phí**: 40,000 requests/tháng
- **Sau đó**: $5.00 per 1,000 requests

### Places API (New)
- **Miễn phí**: Varies by request type
- **Autocomplete**: $2.83 per 1,000 requests
- **Place Details**: $3.00 per 1,000 requests

### Ước tính chi phí cho ứng dụng
- **Nhỏ** (< 1000 bài đăng/tháng): **Miễn phí**
- **Trung bình** (1000-5000 bài đăng/tháng): **$10-50/tháng**
- **Lớn** (> 5000 bài đăng/tháng): **$50-200/tháng**

## Tối ưu hóa chi phí

### 1. Caching
```javascript
// Cache kết quả geocoding trong localStorage
const cachedResult = localStorage.getItem(`geocode_${address}`);
if (cachedResult) {
  return JSON.parse(cachedResult);
}
```

### 2. Debouncing
```javascript
// Chỉ gọi API sau khi user ngừng nhập 500ms
const timer = setTimeout(() => {
  searchAddresses(newValue);
}, 500);
```

### 3. Giới hạn requests
```javascript
// Chỉ tìm kiếm khi có ít nhất 3 ký tự
if (query.length < 3) return;
```

## Troubleshooting

### Lỗi "API key not configured"
- Kiểm tra file `.env` có đúng tên biến không
- Restart ứng dụng sau khi thêm API key

### Lỗi "REQUEST_DENIED"
- Kiểm tra API key có đúng không
- Kiểm tra các API đã được bật chưa
- Kiểm tra domain restrictions

### Lỗi "OVER_QUERY_LIMIT"
- Đã vượt quota miễn phí
- Cần bật billing trong Google Cloud Console

### Không có gợi ý địa chỉ
- Kiểm tra Places API đã được bật chưa
- Kiểm tra network requests trong DevTools

## Monitoring và Analytics

### 1. Google Cloud Console
- Vào "APIs & Services" → "Dashboard"
- Xem usage statistics
- Set up alerts khi gần đạt quota

### 2. Application Logs
```javascript
// Log trong console để debug
console.log('✅ Geocoding successful:', result);
console.log('❌ Geocoding failed:', error);
```

## Backup Plan (Không có Google Maps API)

Nếu không muốn sử dụng Google Maps API, có thể:

1. **Sử dụng OpenStreetMap Nominatim** (miễn phí nhưng hạn chế)
2. **Nhập tọa độ thủ công** (như hiện tại)
3. **Sử dụng danh sách địa điểm có sẵn** (dropdown)

## Kết luận

Sau khi cấu hình thành công:
- Nhà tuyển dụng có thể nhập địa chỉ cụ thể
- Hệ thống tự động chuyển đổi thành tọa độ GPS
- Ứng viên tìm được công việc trong bán kính 3km chính xác
- Trải nghiệm người dùng được cải thiện đáng kể