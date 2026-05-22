# Hệ Thống Thông Báo (Notification System)

## Tổng Quan

Hệ thống thông báo tự động cho Admin và Employer khi có các sự kiện liên quan đến gói dịch vụ.

## Luồng Thông Báo

### 1. Employer Mua Gói → Thông Báo Admin

**Khi nào:** Employer nhấn "Xác nhận mua" gói dịch vụ

**Ai nhận:** Admin

**Nội dung:**
- Tiêu đề: "Yêu cầu mua gói dịch vụ mới"
- Thông điệp: "{Tên công ty} yêu cầu mua gói {Tên gói} ({Thời hạn})"
- Icon: Package (📦)
- Màu: Blue (#3b82f6)
- Action: Chuyển đến `/admin/packages`

**Code:**
```javascript
// src/pages/employer/Subscription.jsx
import { createPackagePurchaseRequestNotification } from '../../services/notificationService';

createPackagePurchaseRequestNotification({
  subscriptionId: result.data.subscriptionId,
  employerId: employerId,
  companyName: companyName,
  packageName: selectedPackage.name,
  duration: selectedDuration.duration,
  price: packagePrice
});
```

### 2. Admin Duyệt Gói → Thông Báo Employer

**Khi nào:** Admin nhấn nút "Duyệt" trong tab "Chờ duyệt"

**Ai nhận:** Employer (người mua gói)

**Nội dung:**
- Tiêu đề: "Gói dịch vụ đã được kích hoạt"
- Thông điệp: "Gói {Tên gói} ({Thời hạn}) của bạn đã được admin phê duyệt và kích hoạt thành công!"
- Icon: CheckCircle (✓)
- Màu: Green (#10b981)
- Action: Chuyển đến `/employer/subscription`

**Code:**
```javascript
// src/pages/admin/PackagesManagement.jsx
import { createPackageApprovedNotification } from '../../services/notificationService';

createPackageApprovedNotification(
  {
    subscriptionId: purchaseId,
    packageName: purchase.package,
    duration: purchase.duration,
    expiryDate: updatedSubscription.data?.expiryDate
  },
  subscriptionData.data?.employerId
);
```

## Cấu Trúc Notification

### Notification Object

```javascript
{
  id: "notif-1234567890-abc123",
  type: "package_purchase_request" | "package_approved",
  title: "Tiêu đề tiếng Việt",
  titleEn: "English Title",
  message: "Nội dung tiếng Việt",
  messageEn: "English Message",
  recipientId: "user-id" | "admin",
  recipientRole: "admin" | "employer" | "candidate",
  senderId: "sender-user-id",
  senderName: "Tên người gửi",
  data: {
    subscriptionId: "SUB-20260521-ABC123",
    packageName: "Quick Boost",
    duration: "24h",
    price: 29000
  },
  read: false,
  deleted: false,
  createdAt: "2026-05-21T00:00:00.000Z",
  icon: "package" | "check-circle",
  color: "#3b82f6" | "#10b981",
  actionUrl: "/admin/packages" | "/employer/subscription",
  actionText: "Xem chi tiết",
  actionTextEn: "View Details"
}
```

## Service API

### notificationService.js

**Location:** `src/services/notificationService.js`

**Functions:**

#### 1. getNotifications(userId, role)
Lấy tất cả notifications của một user

```javascript
import { getNotifications } from '../services/notificationService';

const notifications = getNotifications('user-123', 'employer');
```

#### 2. getUnreadCount(userId, role)
Lấy số lượng notifications chưa đọc

```javascript
import { getUnreadCount } from '../services/notificationService';

const count = getUnreadCount('user-123', 'employer');
```

#### 3. createPackagePurchaseRequestNotification(subscription)
Tạo notification khi employer mua gói

```javascript
import { createPackagePurchaseRequestNotification } from '../services/notificationService';

createPackagePurchaseRequestNotification({
  subscriptionId: 'SUB-123',
  employerId: 'emp-456',
  companyName: 'ABC Restaurant',
  packageName: 'Quick Boost',
  duration: '24h',
  price: 29000
});
```

#### 4. createPackageApprovedNotification(subscription, employerId)
Tạo notification khi admin duyệt gói

```javascript
import { createPackageApprovedNotification } from '../services/notificationService';

createPackageApprovedNotification(
  {
    subscriptionId: 'SUB-123',
    packageName: 'Quick Boost',
    duration: '24h',
    expiryDate: '2026-05-22'
  },
  'emp-456'
);
```

#### 5. markAsRead(notificationId)
Đánh dấu notification đã đọc

```javascript
import { markAsRead } from '../services/notificationService';

markAsRead('notif-123');
```

#### 6. markAllAsRead(userId, role)
Đánh dấu tất cả notifications đã đọc

```javascript
import { markAllAsRead } from '../services/notificationService';

markAllAsRead('user-123', 'employer');
```

## UI Components

### 1. Navbar Bell Icon

**Location:** `src/components/Navbar.jsx`

**Features:**
- Hiển thị số lượng notifications chưa đọc (badge)
- Dropdown hiển thị danh sách notifications
- Click vào notification → Đánh dấu đã đọc + Chuyển đến trang liên quan
- Auto-refresh mỗi 10 giây
- Listen storage events (sync giữa các tabs)

**Usage:**
```jsx
// Navbar tự động hiển thị notifications dựa trên user role
<Navbar showSearch={true} />
```

### 2. NotificationBell Component (Optional)

**Location:** `src/components/NotificationBell.jsx`

**Features:**
- Standalone notification bell component
- Có thể dùng ở bất kỳ đâu trong app
- Props: userId, role

**Usage:**
```jsx
import NotificationBell from '../components/NotificationBell';

<NotificationBell userId={user.id} role={user.role} />
```

## Storage

### LocalStorage Key

**Key:** `app_notifications`

**Format:** Array of notification objects

**Max Size:** 100 notifications (tự động trim)

**Example:**
```javascript
localStorage.getItem('app_notifications');
// Returns: '[{...notification1}, {...notification2}, ...]'
```

## Testing

### Test Flow 1: Employer → Admin

1. **Đăng nhập Employer**
   ```
   Email: employer@test.com
   Password: test123
   ```

2. **Mua gói dịch vụ**
   - Vào `/employer/subscription`
   - Chọn gói "Quick Boost"
   - Chọn thời hạn "24h"
   - Nhấn "Xác nhận mua"

3. **Kiểm tra notification**
   - Mở console: `localStorage.getItem('app_notifications')`
   - Xem notification mới được tạo

4. **Đăng nhập Admin**
   ```
   Email: admin@test.com
   Password: admin123
   ```

5. **Xem notification**
   - Click vào bell icon (🔔)
   - Thấy notification "Yêu cầu mua gói dịch vụ mới"
   - Badge hiển thị số "1"

### Test Flow 2: Admin → Employer

1. **Admin duyệt gói**
   - Vào `/admin/packages`
   - Tab "Chờ duyệt"
   - Nhấn nút "Duyệt"

2. **Kiểm tra notification**
   - Mở console: `localStorage.getItem('app_notifications')`
   - Xem notification mới cho employer

3. **Đăng nhập Employer**
   - Click vào bell icon (🔔)
   - Thấy notification "Gói dịch vụ đã được kích hoạt"
   - Badge hiển thị số "1"

4. **Click vào notification**
   - Notification được đánh dấu đã đọc
   - Chuyển đến trang `/employer/subscription`

## Troubleshooting

### Notification không hiển thị

**Nguyên nhân:**
- LocalStorage bị clear
- User ID không đúng
- Role không đúng

**Giải pháp:**
```javascript
// Check localStorage
console.log(localStorage.getItem('app_notifications'));

// Check user info
console.log(user.id, user.role);

// Manually create test notification
import { createPackagePurchaseRequestNotification } from './services/notificationService';
createPackagePurchaseRequestNotification({
  subscriptionId: 'TEST-123',
  employerId: 'test-emp',
  companyName: 'Test Company',
  packageName: 'Quick Boost',
  duration: '24h',
  price: 29000
});
```

### Badge không cập nhật

**Nguyên nhân:**
- Storage event không trigger
- Component không re-render

**Giải pháp:**
```javascript
// Manually trigger storage event
window.dispatchEvent(new Event('storage'));

// Force reload notifications
window.location.reload();
```

### Notification không sync giữa các tabs

**Nguyên nhân:**
- Storage event chỉ trigger ở tabs khác, không trigger ở tab hiện tại

**Giải pháp:**
- Đã implement: `window.dispatchEvent(new Event('storage'))` sau khi save
- Auto-refresh mỗi 10 giây

## Future Enhancements

1. **Database Storage**
   - Lưu notifications vào DynamoDB thay vì localStorage
   - Sync across devices

2. **Push Notifications**
   - Browser push notifications
   - Email notifications

3. **Notification Types**
   - Job application notifications
   - Payment notifications
   - System announcements

4. **Notification Settings**
   - User preferences
   - Mute/unmute notifications
   - Notification frequency

5. **Real-time Updates**
   - WebSocket connection
   - Instant notification delivery
