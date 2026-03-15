# Debug Geocoding Feature

## Kiểm tra lỗi nhanh

### 1. Mở Browser Console
- Nhấn F12 hoặc Ctrl+Shift+I
- Vào tab Console

### 2. Test các service
```javascript
// Test geocoding service
import('./src/utils/debugServices.js').then(({ runAllTests }) => runAllTests());
```

### 3. Test AddressInput component
- Vào trang đăng bài tuyển dụng
- Mở Console và xem có lỗi gì không
- Nhập địa chỉ và xem response

## Các lỗi thường gặp

### 1. "process is not defined"
✅ **Đã sửa** - Thay `process.env` bằng safe check

### 2. "animate-spin class not found"
✅ **Đã sửa** - Thay bằng inline CSS animation

### 3. "Duplicate import"
✅ **Đã sửa** - Loại bỏ duplicate imports

### 4. "Google Maps API key not configured"
⚠️ **Bình thường** - Cần cấu hình API key:
```bash
# Thêm vào .env
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 5. "CORS error" hoặc "Network error"
- Kiểm tra internet connection
- Kiểm tra API key có đúng không
- Kiểm tra domain restrictions trong Google Cloud Console

## Test từng bước

### Bước 1: Test service import
```javascript
import('./src/services/geocodingService.js').then(service => {
  console.log('Service loaded:', service.default);
  console.log('API configured:', service.default.isConfigured());
});
```

### Bước 2: Test geocoding
```javascript
import('./src/services/geocodingService.js').then(async service => {
  try {
    const result = await service.default.geocodeAddress('Chợ Bến Thành, Quận 1, TP.HCM');
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
});
```

### Bước 3: Test component
- Vào `/employer/post-quick-job`
- Nhập địa chỉ trong trường "Địa điểm làm việc"
- Xem console có lỗi gì không

## Nếu vẫn có lỗi

1. **Restart development server**
   ```bash
   npm start
   ```

2. **Clear browser cache**
   - Ctrl+Shift+R (hard refresh)
   - Hoặc xóa cache trong DevTools

3. **Kiểm tra network tab**
   - Xem có request nào fail không
   - Kiểm tra response status

4. **Fallback mode**
   - Nếu không có Google Maps API key
   - Component vẫn hoạt động như input bình thường
   - Có thể nhập tọa độ thủ công

## Liên hệ hỗ trợ

Nếu vẫn gặp lỗi, cung cấp:
1. Screenshot console errors
2. Browser và version
3. Các bước đã thử
4. File .env có được cấu hình chưa