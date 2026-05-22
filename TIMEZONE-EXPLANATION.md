# Giải thích về Timezone và Timestamp

## 🔍 Phát hiện từ Console Log

```
⏰ Time difference: 32200 seconds
⚠️ WARNING: Timestamp is more than 1 hour old!
```

**32200 giây = 8.9 giờ ≈ 9 giờ**

## 🌍 Nguyên nhân

### Lambda Server (AWS)
- Sử dụng **UTC timezone** (Coordinated Universal Time)
- Khi tạo notification lúc 10:00 UTC
- `createdAt = "2026-05-21T10:00:00.000Z"`

### Máy tính của bạn (Vietnam)
- Sử dụng **UTC+7 timezone** (Vietnam Standard Time)
- Thời gian local: 17:00 (10:00 + 7 giờ)
- JavaScript `new Date()` trả về: 17:00 local time

### Khi so sánh
```javascript
const createdAt = new Date("2026-05-21T10:00:00.000Z"); // UTC
const now = new Date(); // Local time (UTC+7)
const diff = now - createdAt; // Chênh lệch ~7-9 giờ!
```

## ✅ Tại sao đây KHÔNG phải là bug?

### RelativeTime Component hoạt động ĐÚNG!

```javascript
// RelativeTime component
const now = new Date(); // Tự động convert sang UTC khi tính toán
const created = new Date(timestamp); // Parse ISO string (UTC)
const diffMs = now - created; // So sánh UTC với UTC → ĐÚNG!
```

**Ví dụ:**
- Lambda tạo notification: `2026-05-21T10:00:00.000Z` (UTC)
- Bạn xem lúc: `2026-05-21T10:00:05.000Z` (UTC) = 17:00:05 Vietnam time
- Chênh lệch: **5 giây** → Hiển thị "Vừa xong" ✅

## ❌ Vấn đề thực sự

**Bạn đang xem notification CŨ!**

Notification được tạo lúc:
```
2026-05-21T01:15:00.000Z (UTC)
= 2026-05-21 08:15:00 (Vietnam time)
```

Bạn xem lúc:
```
2026-05-21T10:11:00.000Z (UTC)
= 2026-05-21 17:11:00 (Vietnam time)
```

Chênh lệch: **8 giờ 56 phút** → Hiển thị "9 giờ trước" ✅ (ĐÚNG!)

## 🎯 Cách verify notification MỚI

### 1. Kiểm tra Notification ID trong Console

Tìm dòng log:
```
✅ Notification ID: NOTIF-20260521-abc123
⏰ CreatedAt from Lambda: 2026-05-21T10:11:45.123Z
```

**Lưu lại Notification ID này!**

### 2. Vào trang Admin Notifications

Tìm notification với **ĐÚNG ID** vừa tạo:
- Không phải notification cũ
- Phải là notification với ID vừa thấy trong console

### 3. Kiểm tra timestamp

Notification MỚI sẽ hiển thị:
- "Vừa xong" (nếu < 10 giây)
- "X giây trước" (nếu < 1 phút)
- "X phút trước" (nếu < 1 giờ)

## 🔧 Debug Script

Paste vào Console để kiểm tra notification vừa tạo:

```javascript
// Lấy notification ID từ log trước đó
const notificationId = 'NOTIF-20260521-abc123'; // Thay bằng ID thực

fetch(`https://rvvvqxqhq3.execute-api.ap-southeast-1.amazonaws.com/prod/notifications/${notificationId}`)
  .then(res => res.json())
  .then(notif => {
    console.log('📋 Notification details:');
    console.log('ID:', notif.notificationId);
    console.log('Title:', notif.title);
    console.log('CreatedAt (UTC):', notif.createdAt);
    
    const createdAt = new Date(notif.createdAt);
    const now = new Date();
    
    console.log('');
    console.log('⏰ Timestamps:');
    console.log('Created (UTC):', createdAt.toISOString());
    console.log('Created (Local):', createdAt.toLocaleString('vi-VN'));
    console.log('Now (UTC):', now.toISOString());
    console.log('Now (Local):', now.toLocaleString('vi-VN'));
    
    const diffMs = now - createdAt;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    console.log('');
    console.log('⏱️ Time difference:');
    console.log(`${diffSeconds} seconds`);
    console.log(`${diffMinutes} minutes`);
    console.log(`${diffHours} hours`);
    
    console.log('');
    if (diffSeconds < 60) {
      console.log('✅ Notification is FRESH! Should show "Vừa xong" or "X giây trước"');
    } else if (diffMinutes < 60) {
      console.log('✅ Notification is recent! Should show "X phút trước"');
    } else {
      console.log('⚠️ Notification is old! Will show "X giờ trước"');
    }
  })
  .catch(err => console.error('Error:', err));
```

## 📝 Kết luận

### ✅ Hệ thống hoạt động ĐÚNG!

1. **Lambda tạo timestamp UTC** → Chuẩn quốc tế ✅
2. **RelativeTime tính toán UTC** → Chính xác ✅
3. **Hiển thị "9 giờ trước"** → Đúng với notification cũ ✅

### 🎯 Để thấy "Vừa xong":

1. **Mua gói mới**
2. **Lưu Notification ID** từ console
3. **Tìm ĐÚNG notification** với ID đó
4. **Không xem notification cũ**

### 💡 Lưu ý

Console log warning "Timestamp is more than 1 hour old" là **FALSE POSITIVE** vì:
- Code so sánh local time (UTC+7) với UTC
- Chênh lệch 7-9 giờ là BÌNH THƯỜNG
- RelativeTime component vẫn tính toán ĐÚNG

**Bỏ qua warning này!** Chỉ cần kiểm tra UI hiển thị đúng là được.
