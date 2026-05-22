# Force Refresh Notifications

## Vấn đề
Notification mới (ID: NOTIF-20260521-9b23d955) đã được tạo thành công trong database, nhưng KHÔNG hiển thị trong UI.

## Nguyên nhân có thể

### 1. Trang chưa reload data
- Component đã load data trước khi notification được tạo
- Cần refresh để fetch lại

### 2. API polling chưa chạy
- Polling interval là 10 giây
- Có thể chưa đến lượt poll

### 3. Cache cũ
- Browser đang cache response cũ
- Cần clear cache

## Giải pháp

### Option 1: Hard Refresh Trang (Nhanh nhất)
```
1. Đang ở trang: http://localhost:3000/OpPoReview/admin/notifications
2. Nhấn: Ctrl + Shift + R (hoặc Ctrl + F5)
3. Đợi trang load lại
4. Kiểm tra notification mới có xuất hiện không
```

### Option 2: Navigate Away & Back
```
1. Click vào menu khác (ví dụ: Dashboard)
2. Đợi 2 giây
3. Click lại vào Notifications
4. Trang sẽ fetch data mới
```

### Option 3: Force Reload từ Console
```javascript
// Paste vào Console và nhấn Enter
window.location.reload(true);
```

### Option 4: Verify notification trong database
```javascript
// Paste vào Console để kiểm tra notification có tồn tại không
fetch('https://rvvvqxqhq3.execute-api.ap-southeast-1.amazonaws.com/prod/notifications?recipientId=admin&recipientRole=admin')
  .then(res => res.json())
  .then(notifications => {
    console.log(`📥 Total notifications: ${notifications.length}`);
    
    // Tìm notification mới nhất
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log('');
    console.log('📋 Top 5 latest notifications:');
    notifications.slice(0, 5).forEach((notif, index) => {
      const createdAt = new Date(notif.createdAt);
      const now = new Date();
      const diffMinutes = Math.floor((now - createdAt) / 60000);
      
      console.log(`${index + 1}. ${notif.notificationId}`);
      console.log(`   Title: ${notif.title}`);
      console.log(`   Created: ${createdAt.toLocaleString('vi-VN')}`);
      console.log(`   Age: ${diffMinutes} minutes ago`);
      console.log('');
    });
    
    // Tìm notification cụ thể
    const targetId = 'NOTIF-20260521-9b23d955';
    const found = notifications.find(n => n.notificationId === targetId);
    
    if (found) {
      console.log('✅ FOUND target notification!');
      console.log('   It EXISTS in database but NOT showing in UI');
      console.log('   → Need to refresh the page!');
    } else {
      console.log('❌ Target notification NOT found in database');
      console.log('   → Notification creation might have failed');
    }
  })
  .catch(err => console.error('Error:', err));
```

## Kiểm tra Component Polling

Có thể component polling bị lỗi. Hãy kiểm tra:

```javascript
// Xem console có log polling không
// Tìm dòng: "📥 [AdminNotifications] Received notifications: X"
```

Nếu KHÔNG thấy log này, component polling không hoạt động.

## Debug Component State

```javascript
// Kiểm tra React component state (nếu có React DevTools)
// 1. Mở React DevTools
// 2. Tìm component AdminNotifications
// 3. Xem state.notifications
// 4. Kiểm tra có notification mới không
```

## Kết luận

Notification ĐÃ được tạo thành công trong database (có log console chứng minh), nhưng UI chưa load nó.

**Giải pháp đơn giản nhất:**
1. Hard refresh trang (Ctrl + Shift + R)
2. Notification mới sẽ xuất hiện
3. Kiểm tra thời gian hiển thị

Nếu sau khi refresh vẫn không thấy, có thể:
- API query filter sai (không lấy được notification cho admin)
- Component có bug trong logic load data
- Notification bị filter ra bởi UI logic
