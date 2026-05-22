# Test Nhanh Hệ Thống Thông Báo

## Đã Sửa

1. ✅ Thay đổi từ dynamic import sang static import
2. ✅ Thêm try-catch để bắt lỗi
3. ✅ Thêm console.log chi tiết

## Cách Test Nhanh

### Bước 1: Mở Test Page

1. Mở file `test-notification-manual.html` trong trình duyệt:
   ```
   http://localhost:3000/test-notification-manual.html
   ```

2. Click "Tạo Notification Cho Admin"
3. Click "Tạo Notification Cho Employer"
4. Click "Xem Tất Cả Notifications" để kiểm tra

### Bước 2: Test Trong App

1. **Reload app** (Ctrl + R hoặc F5)
2. **Mở Developer Console** (F12)
3. Click vào icon chuông 🔔 trên Navbar
4. Bạn sẽ thấy notifications test vừa tạo

### Bước 3: Test Flow Thực Tế

#### Test Employer → Admin

1. Đăng nhập Employer
2. Mở Console (F12)
3. Vào `/employer/subscription`
4. Mua một gói
5. Xem console có dòng:
   ```
   ✅ Notification created for admin: {...}
   ```
6. Đăng nhập Admin
7. Reload trang
8. Xem console có dòng:
   ```
   🔔 Loading notifications for: {userId: "admin", role: "admin", count: 1, notifs: [...]}
   ```
9. Click icon chuông 🔔

#### Test Admin → Employer

1. Admin duyệt gói
2. Xem console có dòng:
   ```
   📧 Creating notification for employer: <employerId>
   ✅ Notification created for employer: {...}
   ```
3. Đăng nhập Employer
4. Reload trang
5. Click icon chuông 🔔

## Debug Commands (Paste vào Console)

### Xem tất cả notifications
```javascript
console.table(JSON.parse(localStorage.getItem('app_notifications') || '[]'))
```

### Xem user hiện tại
```javascript
console.log(JSON.parse(localStorage.getItem('user')))
```

### Tạo test notification cho Admin
```javascript
const testNotif = {
  id: `notif-test-${Date.now()}`,
  type: 'package_purchase_request',
  title: 'TEST: Yêu cầu mua gói dịch vụ mới',
  message: 'Katinat yêu cầu mua gói Quick Boost (24h)',
  recipientId: 'admin',
  recipientRole: 'admin',
  senderId: 'test-emp',
  senderName: 'Katinat',
  data: { subscriptionId: 'TEST-123', packageName: 'Quick Boost', duration: '24h', price: 29000 },
  read: false,
  deleted: false,
  createdAt: new Date().toISOString(),
  icon: 'package',
  color: '#3b82f6',
  actionUrl: '/admin/packages'
};
const notifs = JSON.parse(localStorage.getItem('app_notifications') || '[]');
notifs.unshift(testNotif);
localStorage.setItem('app_notifications', JSON.stringify(notifs));
window.dispatchEvent(new Event('storage'));
console.log('✅ Created test notification for admin');
```

### Xóa tất cả notifications
```javascript
localStorage.removeItem('app_notifications');
window.location.reload();
```

## Nếu Vẫn Không Hoạt Động

1. **Kiểm tra Console có lỗi không**
   - Mở F12 → Console tab
   - Tìm dòng màu đỏ (errors)

2. **Kiểm tra file notificationService.js có tồn tại không**
   ```
   src/services/notificationService.js
   ```

3. **Clear cache và reload**
   - Ctrl + Shift + R (hard reload)
   - Hoặc Ctrl + Shift + Delete → Clear cache

4. **Kiểm tra localStorage**
   - F12 → Application tab → Local Storage
   - Xem có key `app_notifications` không

5. **Test với test page**
   - Mở `test-notification-manual.html`
   - Tạo test notifications
   - Quay lại app và reload

## Kết Quả Mong Đợi

✅ Console hiển thị logs khi tạo notification
✅ LocalStorage có notifications
✅ Badge số hiển thị trên icon chuông
✅ Click chuông thấy danh sách notifications
✅ Click notification → chuyển đến trang tương ứng
