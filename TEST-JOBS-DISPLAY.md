# 🧪 Hướng dẫn Test Hiển thị Jobs từ DynamoDB

## ✅ Đã hoàn thành

1. **CORS đã được cấu hình cho TẤT CẢ endpoints:**
   - ✅ `/jobs` - POST (tạo job mới)
   - ✅ `/jobs/active` - GET (lấy tất cả jobs active)
   - ✅ `/jobs/employer/{employerId}` - GET (lấy jobs của employer)
   - ✅ `/jobs/{idJob}` - GET, PUT, DELETE (chi tiết job)
   - ✅ `/jobs/{idJob}/views` - POST (tăng lượt xem)

2. **API đã được test và hoạt động:**
   - ✅ PowerShell test thành công
   - ✅ Trả về đúng 1 job: "Nhân viên pha chế"
   - ✅ CORS headers đúng: `Access-Control-Allow-Origin: *`

3. **Code đã được cập nhật:**
   - ✅ `Applications.jsx` load jobs từ DynamoDB qua `jobPostService`
   - ✅ `jobPostService.js` có đầy đủ logging để debug
   - ✅ Tự động fallback về `getAllActiveJobs()` nếu không có auth

## 🧪 Các bước test

### Bước 1: Test API từ Browser
Mở file `test-jobs-browser.html` trong browser:
```bash
# Mở file trong browser mặc định
start test-jobs-browser.html
```

Bấm nút "GET /jobs/active" để test. Bạn sẽ thấy:
- ✅ Job "Nhân viên pha chế" hiển thị
- ✅ Thông tin đầy đủ: location, salary, workHours, etc.

### Bước 2: Test trong ứng dụng React

1. **Mở browser DevTools (F12)**
2. **Vào tab Console**
3. **Chạy ứng dụng và vào trang Applications**
4. **Xem logs trong console:**

Bạn sẽ thấy các logs như:
```
🚀 getMyJobPosts() called
✅ User authenticated, userId: xxx
hoặc
⚠️ No authentication - getting all active jobs instead
🚀 getAllActiveJobs() called
📡 Calling API: /jobs/active
📥 API Response: {success: true, data: [...]}
✅ Active jobs loaded from DynamoDB: 1 jobs
📦 Jobs data: [...]
```

### Bước 3: Xóa cache browser (nếu cần)

Nếu vẫn không thấy jobs, hãy:
1. **Hard refresh:** `Ctrl + Shift + R` (Windows) hoặc `Cmd + Shift + R` (Mac)
2. **Xóa cache:**
   - Mở DevTools (F12)
   - Right-click vào nút Refresh
   - Chọn "Empty Cache and Hard Reload"

### Bước 4: Kiểm tra Network tab

1. Mở DevTools (F12)
2. Vào tab **Network**
3. Reload trang
4. Tìm request đến `/jobs/active` hoặc `/jobs/employer/...`
5. Kiểm tra:
   - ✅ Status: 200 OK
   - ✅ Response có data
   - ✅ Headers có `Access-Control-Allow-Origin`

## 🐛 Troubleshooting

### Vấn đề: Không thấy jobs hiển thị

**Giải pháp 1: Kiểm tra Console logs**
```javascript
// Mở Console (F12) và chạy:
localStorage.clear(); // Xóa cache
location.reload(); // Reload trang
```

**Giải pháp 2: Test API trực tiếp**
```javascript
// Trong Console, chạy:
fetch('https://dlidp35x33.execute-api.ap-southeast-1.amazonaws.com/prod/jobs/active')
  .then(r => r.json())
  .then(d => console.log('Jobs:', d));
```

**Giải pháp 3: Kiểm tra authentication**
```javascript
// Trong Console, chạy:
import { fetchAuthSession } from 'aws-amplify/auth';
fetchAuthSession().then(s => console.log('Session:', s));
```

### Vấn đề: CORS error

Nếu vẫn thấy CORS error, chạy lại script:
```powershell
./fix-all-cors.ps1
```

Sau đó hard refresh browser (Ctrl + Shift + R).

## 📊 Dữ liệu hiện tại trong DynamoDB

Hiện có **1 job** trong bảng PostStandardJob:
- **ID:** JOB-20260312-V77L7
- **Title:** Nhân viên pha chế
- **Location:** Quận 1, TP.HCM
- **Salary:** 23000 VNĐ/h
- **Status:** active
- **Work Hours:** 17:00 - 22:00
- **Work Days:** 2026-03-20

## 🎯 Kết quả mong đợi

Sau khi test, bạn sẽ thấy:
1. ✅ Trang Applications hiển thị 1 job card
2. ✅ Job card có đầy đủ thông tin
3. ✅ Có thể click "Xem" để xem chi tiết
4. ✅ Có thể click "Sửa" để chỉnh sửa
5. ✅ Có thể click "Xóa" để xóa job

## 📝 Notes

- Service tự động fallback về `getAllActiveJobs()` nếu user không authenticated
- Tất cả endpoints đều có CORS được cấu hình đúng
- Lambda function xử lý cả authenticated và anonymous requests
- Logging đầy đủ giúp debug dễ dàng
