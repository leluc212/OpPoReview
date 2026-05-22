# Debug Notification Timestamp Issue

## Vấn đề
Sau khi sửa code, notifications vẫn hiển thị "7 giờ trước" thay vì "Vừa xong".

## Các nguyên nhân có thể:

### 1. ❌ Browser Cache
Frontend đang chạy code cũ (chưa reload).

**Giải pháp:**
```bash
# Hard refresh browser
Ctrl + Shift + R (hoặc Ctrl + F5)

# Hoặc clear cache hoàn toàn
F12 → Application → Clear site data
```

### 2. ❌ Đang xem Notifications CŨ
Notifications được tạo TRƯỚC KHI sửa code vẫn có timestamp cũ (7 giờ trước).

**Giải pháp:**
- Tạo notification MỚI (mua gói mới)
- Hoặc xóa notifications cũ

### 3. ❌ Lambda chưa được deploy
Lambda function vẫn đang chạy code cũ.

**Kiểm tra:**
```powershell
# Xem Lambda logs trong CloudWatch
aws logs tail /aws/lambda/notifications-lambda --follow
```

## 🔍 Debug Steps

### Step 1: Kiểm tra Console Log

1. Mở DevTools (F12) → Console tab
2. Clear console (Ctrl + L)
3. Thực hiện action (mua gói mới)
4. Xem log output

**Tìm dòng log này:**
```
💾 Saving notification to API...
Notification object to send: {...}
```

**Kiểm tra:**
- ✅ Payload KHÔNG có field `createdAt`
- ❌ Nếu có `createdAt` → Code cũ vẫn đang chạy

### Step 2: Kiểm tra Network Request

1. DevTools → Network tab
2. Filter: "notifications"
3. Thực hiện action (mua gói mới)
4. Click vào request POST /notifications
5. Xem tab "Payload" hoặc "Request"

**Kiểm tra:**
```json
{
  "type": "package_purchase_request",
  "title": "...",
  "message": "...",
  "recipientId": "admin",
  "recipientRole": "admin",
  // ❌ KHÔNG được có "createdAt" ở đây!
}
```

### Step 3: Kiểm tra Response từ API

Trong cùng Network request, xem tab "Response":

```json
{
  "success": true,
  "data": {
    "notificationId": "NOTIF-20260521-abc123",
    "createdAt": "2026-05-21T10:30:45.123Z",  // ← Timestamp này phải là HIỆN TẠI!
    ...
  }
}
```

**Tính toán:**
- Lấy `createdAt` từ response
- So sánh với thời gian hiện tại
- Nếu chênh lệch > 1 phút → Lambda có vấn đề

### Step 4: Test với API trực tiếp

Gọi API trực tiếp để loại trừ vấn đề frontend:

```javascript
// Paste vào Console
fetch('https://rvvvqxqhq3.execute-api.ap-southeast-1.amazonaws.com/prod/notifications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'package_approved',
    title: 'TEST DIRECT API CALL',
    titleEn: 'TEST DIRECT API CALL',
    message: 'Testing timestamp generation',
    messageEn: 'Testing timestamp generation',
    recipientId: 'YOUR_EMPLOYER_ID',  // Thay bằng ID thực
    recipientRole: 'employer',
    senderId: 'admin',
    senderName: 'Admin',
    icon: 'check-circle',
    color: '#10b981',
    actionUrl: '/test',
    actionText: 'Test',
    actionTextEn: 'Test'
    // KHÔNG gửi createdAt!
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Response:', data);
  const createdAt = new Date(data.data.createdAt);
  const now = new Date();
  const diffSeconds = Math.floor((now - createdAt) / 1000);
  console.log(`⏰ Created: ${createdAt.toLocaleString()}`);
  console.log(`⏰ Now: ${now.toLocaleString()}`);
  console.log(`⏰ Difference: ${diffSeconds} seconds`);
  
  if (diffSeconds < 5) {
    console.log('✅ TIMESTAMP CHÍNH XÁC! Lambda đang hoạt động đúng!');
  } else {
    console.log('❌ TIMESTAMP SAI! Lambda có vấn đề!');
  }
})
.catch(err => console.error('❌ Error:', err));
```

## 🎯 Kết quả mong đợi

### ✅ Nếu mọi thứ đúng:

**Console Log:**
```
💾 Saving notification to API...
Notification object to send: {
  type: "package_purchase_request",
  title: "...",
  // KHÔNG có createdAt
}
✅ Response received!
API Response status: 201
```

**Network Request Payload:**
```json
{
  "type": "package_purchase_request",
  // KHÔNG có createdAt
}
```

**Network Response:**
```json
{
  "success": true,
  "data": {
    "createdAt": "2026-05-21T10:30:45.123Z"  // Timestamp HIỆN TẠI
  }
}
```

**UI hiển thị:**
```
Gói dịch vụ đã được kích hoạt
⏰ Vừa xong
```

### ❌ Nếu vẫn sai:

**Có thể thấy:**
- Request payload có `createdAt` → Frontend cache
- Response `createdAt` cũ (7 giờ trước) → Lambda có vấn đề
- UI vẫn hiển thị "7 giờ trước" → Đang xem notification cũ

## 🚀 Giải pháp nhanh

### Option 1: Force Refresh Everything
```bash
# 1. Clear browser cache
Ctrl + Shift + Delete → Clear all

# 2. Restart dev server
Ctrl + C (stop)
npm start (restart)

# 3. Hard refresh browser
Ctrl + Shift + R
```

### Option 2: Xóa tất cả notifications cũ
```powershell
# Chạy script xóa notifications cũ
.\delete-old-notifications.ps1

# Sau đó tạo mới
# Mua gói mới → Sẽ thấy "Vừa xong"
```

### Option 3: Test với Incognito Mode
```
1. Mở Incognito/Private window
2. Đăng nhập
3. Mua gói mới
4. Kiểm tra timestamp
```

## 📝 Checklist

- [ ] Hard refresh browser (Ctrl + Shift + R)
- [ ] Check console log - payload KHÔNG có createdAt
- [ ] Check network request - payload KHÔNG có createdAt
- [ ] Check network response - createdAt là timestamp hiện tại
- [ ] Tạo notification MỚI (không xem notification cũ)
- [ ] Verify UI hiển thị "Vừa xong" hoặc "X giây trước"

Nếu sau tất cả các bước trên vẫn sai, có thể Lambda function chưa được deploy đúng!
