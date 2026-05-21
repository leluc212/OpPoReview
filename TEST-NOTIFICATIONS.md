# Hướng Dẫn Test Hệ Thống Thông Báo

## Vấn Đề Đã Sửa

1. **Cải thiện logic lọc thông báo cho Admin**: Admin giờ có thể nhận thông báo với `recipientId = 'admin'` hoặc `recipientId = userId` của admin
2. **Thêm console.log để debug**: Giúp theo dõi quá trình tạo và load thông báo
3. **Đảm bảo employerId được truyền đúng**: Khi admin duyệt gói, employerId được lấy từ subscription data

## Cách Test

### Test 1: Employer Mua Gói → Admin Nhận Thông Báo

1. **Đăng nhập với tài khoản Employer**
   - Mở trình duyệt và đăng nhập
   - Mở Developer Console (F12)

2. **Mua gói dịch vụ**
   - Vào trang `/employer/subscription`
   - Chọn một gói (ví dụ: Quick Boost)
   - Chọn thời hạn (24h hoặc 7 ngày)
   - Nhấn "Xác nhận mua"

3. **Kiểm tra Console**
   - Tìm dòng: `✅ Notification created for admin:`
   - Xem chi tiết notification object

4. **Kiểm tra LocalStorage**
   ```javascript
   // Paste vào Console
   JSON.parse(localStorage.getItem('app_notifications'))
   ```
   - Xem notification mới nhất có `recipientRole: 'admin'` không

5. **Đăng nhập Admin**
   - Đăng xuất Employer
   - Đăng nhập với tài khoản Admin
   - Mở Developer Console (F12)

6. **Kiểm tra thông báo**
   - Tìm dòng: `🔔 Loading notifications for:`
   - Xem `count` có > 0 không
   - Click vào icon chuông (🔔) trên Navbar
   - Xem thông báo "Yêu cầu mua gói dịch vụ mới"

### Test 2: Admin Duyệt Gói → Employer Nhận Thông Báo

1. **Đăng nhập Admin (tiếp từ Test 1)**
   - Vào trang `/admin/packages`
   - Tab "Chờ duyệt"

2. **Duyệt gói**
   - Nhấn nút "Duyệt" cho gói vừa mua
   - Mở Developer Console (F12)

3. **Kiểm tra Console**
   - Tìm dòng: `📧 Creating notification for employer:`
   - Tìm dòng: `✅ Notification created for employer:`
   - Xem chi tiết notification object

4. **Kiểm tra LocalStorage**
   ```javascript
   // Paste vào Console
   JSON.parse(localStorage.getItem('app_notifications'))
   ```
   - Xem notification mới nhất có `recipientRole: 'employer'` không
   - Xem `recipientId` có khớp với employerId không

5. **Đăng nhập Employer**
   - Đăng xuất Admin
   - Đăng nhập lại với tài khoản Employer
   - Mở Developer Console (F12)

6. **Kiểm tra thông báo**
   - Tìm dòng: `🔔 Loading notifications for:`
   - Xem `count` có > 0 không
   - Click vào icon chuông (🔔) trên Navbar
   - Xem thông báo "Gói dịch vụ đã được kích hoạt"

## Debug Commands

### Xem tất cả notifications
```javascript
JSON.parse(localStorage.getItem('app_notifications'))
```

### Xem notifications cho Admin
```javascript
const notifs = JSON.parse(localStorage.getItem('app_notifications'));
notifs.filter(n => n.recipientRole === 'admin' && !n.deleted)
```

### Xem notifications cho Employer
```javascript
const notifs = JSON.parse(localStorage.getItem('app_notifications'));
notifs.filter(n => n.recipientRole === 'employer' && !n.deleted)
```

### Xem notifications chưa đọc
```javascript
const notifs = JSON.parse(localStorage.getItem('app_notifications'));
notifs.filter(n => !n.read && !n.deleted)
```

### Xóa tất cả notifications (để test lại từ đầu)
```javascript
localStorage.removeItem('app_notifications');
window.location.reload();
```

### Tạo notification test cho Admin
```javascript
const testNotif = {
  id: `notif-test-${Date.now()}`,
  type: 'package_purchase_request',
  title: 'TEST: Yêu cầu mua gói dịch vụ mới',
  titleEn: 'TEST: New Package Purchase Request',
  message: 'Test Company yêu cầu mua gói Quick Boost (24h)',
  messageEn: 'Test Company requested to purchase Quick Boost package (24h)',
  recipientId: 'admin',
  recipientRole: 'admin',
  senderId: 'test-employer',
  senderName: 'Test Company',
  data: { subscriptionId: 'TEST-123', packageName: 'Quick Boost', duration: '24h', price: 29000 },
  read: false,
  deleted: false,
  createdAt: new Date().toISOString(),
  icon: 'package',
  color: '#3b82f6',
  actionUrl: '/admin/packages',
  actionText: 'Xem chi tiết',
  actionTextEn: 'View Details'
};

const notifs = JSON.parse(localStorage.getItem('app_notifications') || '[]');
notifs.unshift(testNotif);
localStorage.setItem('app_notifications', JSON.stringify(notifs));
window.dispatchEvent(new Event('storage'));
console.log('✅ Test notification created for admin');
```

### Tạo notification test cho Employer
```javascript
// Lấy employerId hiện tại
const user = JSON.parse(localStorage.getItem('user'));
const employerId = user.id || user.email;

const testNotif = {
  id: `notif-test-${Date.now()}`,
  type: 'package_approved',
  title: 'TEST: Gói dịch vụ đã được kích hoạt',
  titleEn: 'TEST: Package Activated',
  message: 'Gói Quick Boost (24h) của bạn đã được admin phê duyệt và kích hoạt thành công!',
  messageEn: 'Your Quick Boost package (24h) has been approved and activated!',
  recipientId: employerId,
  recipientRole: 'employer',
  senderId: 'admin',
  senderName: 'Admin',
  data: { subscriptionId: 'TEST-123', packageName: 'Quick Boost', duration: '24h' },
  read: false,
  deleted: false,
  createdAt: new Date().toISOString(),
  icon: 'check-circle',
  color: '#10b981',
  actionUrl: '/employer/subscription',
  actionText: 'Xem gói của tôi',
  actionTextEn: 'View My Packages'
};

const notifs = JSON.parse(localStorage.getItem('app_notifications') || '[]');
notifs.unshift(testNotif);
localStorage.setItem('app_notifications', JSON.stringify(notifs));
window.dispatchEvent(new Event('storage'));
console.log('✅ Test notification created for employer:', employerId);
```

## Các Vấn Đề Thường Gặp

### 1. Thông báo không hiển thị

**Nguyên nhân:**
- User ID không khớp
- Role không đúng
- LocalStorage bị clear

**Giải pháp:**
```javascript
// Kiểm tra user info
const user = JSON.parse(localStorage.getItem('user'));
console.log('Current user:', user);

// Kiểm tra notifications
const notifs = JSON.parse(localStorage.getItem('app_notifications') || '[]');
console.log('All notifications:', notifs);

// Kiểm tra notifications cho user hiện tại
const userId = user.role === 'admin' ? 'admin' : user.id || user.email;
const myNotifs = notifs.filter(n => {
  if (user.role === 'admin') {
    return (n.recipientId === 'admin' || n.recipientId === userId) && n.recipientRole === 'admin' && !n.deleted;
  }
  return n.recipientId === userId && n.recipientRole === user.role && !n.deleted;
});
console.log('My notifications:', myNotifs);
```

### 2. Badge không cập nhật

**Nguyên nhân:**
- Storage event không trigger
- Component không re-render

**Giải pháp:**
```javascript
// Manually trigger storage event
window.dispatchEvent(new Event('storage'));

// Force reload
window.location.reload();
```

### 3. Notification không sync giữa các tabs

**Nguyên nhân:**
- Storage event chỉ trigger ở tabs khác

**Giải pháp:**
- Đã implement: `window.dispatchEvent(new Event('storage'))` sau khi save
- Auto-refresh mỗi 10 giây

## Kết Quả Mong Đợi

### Sau khi Employer mua gói:
- ✅ Console hiển thị: `✅ Notification created for admin:`
- ✅ LocalStorage có notification mới với `recipientRole: 'admin'`
- ✅ Admin thấy badge số trên icon chuông
- ✅ Admin click chuông thấy thông báo "Yêu cầu mua gói dịch vụ mới"

### Sau khi Admin duyệt gói:
- ✅ Console hiển thị: `📧 Creating notification for employer:` và `✅ Notification created for employer:`
- ✅ LocalStorage có notification mới với `recipientRole: 'employer'`
- ✅ Employer thấy badge số trên icon chuông
- ✅ Employer click chuông thấy thông báo "Gói dịch vụ đã được kích hoạt"

## Lưu Ý

1. **LocalStorage**: Thông báo được lưu trong localStorage, nên chỉ sync trong cùng một trình duyệt
2. **Max 100 notifications**: Hệ thống tự động trim để giữ tối đa 100 notifications
3. **Auto-refresh**: Navbar tự động refresh notifications mỗi 10 giây
4. **Storage event**: Khi tạo notification mới, hệ thống trigger storage event để sync giữa các tabs

## Next Steps

Nếu vẫn không hoạt động sau khi test:
1. Kiểm tra Console logs
2. Kiểm tra LocalStorage
3. Kiểm tra user ID và role
4. Thử tạo test notification bằng debug commands
5. Kiểm tra xem có lỗi JavaScript nào không
