# 🧪 Test Notification Flow - Employer Package Approval

## Vấn đề
Admin duyệt gói nhưng Employer không nhận được thông báo.

## Các bước kiểm tra

### 1. ✅ Kiểm tra Code đã sửa
- [x] `PackagesManagement.jsx` có logic tạo thông báo khi duyệt
- [x] `notificationService.js` có function `createPackageApprovedNotification`
- [x] `USE_API = true` đã được bật
- [x] API endpoint đã được cấu hình: `https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com`

### 2. 🔍 Debug Steps

#### Bước 1: Mở DevTools Console (F12)
```
1. Vào trang Admin: http://localhost:3000/admin/packages
2. Mở DevTools (F12) → Tab Console
3. Xóa console (Clear console)
```

#### Bước 2: Duyệt một gói
```
1. Click tab "Chờ duyệt"
2. Click nút "Duyệt" trên một gói bất kỳ
3. Quan sát Console log
```

#### Bước 3: Kiểm tra Console Log
Bạn sẽ thấy các log sau:
```javascript
// 1. Subscription data
📦 Full subscription response: {
  "success": true,
  "data": {
    "subscriptionId": "SUB-xxx",
    "employerId": "employer@example.com",  // ← CẦN CÓ FIELD NÀY
    "companyName": "...",
    "packageName": "...",
    ...
  }
}

// 2. Extracted employerId
📧 Extracted employerId: "employer@example.com"

// 3. Notification data
🔔 Creating notification with data: {
  subscriptionId: "SUB-xxx",
  packageName: "Quick Boost",
  duration: "7 ngày",
  expiryDate: "2026-05-28",
  employerId: "employer@example.com"
}

// 4. Success
✅ Notification saved: {...}
✅ Notification sent to employer successfully
```

### 3. ❌ Các lỗi có thể gặp

#### Lỗi 1: Không tìm thấy employerId
```
❌ No employerId found in subscription data
Available keys: ["subscriptionId", "companyName", "packageName", ...]
```
**Nguyên nhân**: Subscription không có field `employerId`
**Giải pháp**: Kiểm tra dữ liệu trong DynamoDB table `PackageSubscriptions`

#### Lỗi 2: API Error
```
❌ Error creating notification: Failed to save notification
```
**Nguyên nhân**: Notifications API không hoạt động
**Giải pháp**: Kiểm tra API endpoint và Lambda function

#### Lỗi 3: CORS Error
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```
**Nguyên nhân**: API Gateway chưa cấu hình CORS
**Giải pháp**: Thêm CORS headers vào Lambda response

### 4. 🔎 Kiểm tra DynamoDB

#### Kiểm tra Subscriptions Table
```bash
# Xem subscription có employerId không
aws dynamodb get-item \
  --table-name PackageSubscriptions \
  --key '{"subscriptionId": {"S": "SUB-xxx"}}'
```

Kết quả mong đợi:
```json
{
  "Item": {
    "subscriptionId": {"S": "SUB-xxx"},
    "employerId": {"S": "employer@example.com"},  // ← PHẢI CÓ
    "companyName": {"S": "..."},
    ...
  }
}
```

#### Kiểm tra Notifications Table
```bash
# Xem thông báo đã được tạo chưa
aws dynamodb scan \
  --table-name Notifications \
  --filter-expression "recipientRole = :role" \
  --expression-attribute-values '{":role":{"S":"employer"}}'
```

### 5. 🧪 Test Manual

#### Test 1: Tạo thông báo thủ công
Mở Console trong trang Employer và chạy:
```javascript
// Import service
const { createPackageApprovedNotification } = await import('/src/services/notificationService.js');

// Tạo thông báo test
await createPackageApprovedNotification(
  {
    subscriptionId: 'TEST-123',
    packageName: 'Quick Boost',
    duration: '7 ngày',
    expiryDate: '2026-05-28'
  },
  'employer@example.com'  // Thay bằng email employer thật
);
```

#### Test 2: Kiểm tra Employer nhận được thông báo
```
1. Login as Employer
2. Vào Dashboard: http://localhost:3000/employer/dashboard
3. Kiểm tra NotificationsSidebar bên phải
4. Hoặc vào: http://localhost:3000/employer/notifications
```

### 6. 🐛 Common Issues

#### Issue 1: Subscription không có employerId
**Nguyên nhân**: Khi Employer mua gói, không lưu employerId vào DynamoDB

**Giải pháp**: Kiểm tra file `Subscription.jsx` (Employer page)
```javascript
// Phải gửi employerId khi tạo subscription
const subscriptionData = {
  employerId: user.id || user.email,  // ← PHẢI CÓ
  companyName: employerProfile.companyName,
  packageName: selectedPackage.name,
  duration: selectedDuration
};
```

#### Issue 2: employerId không khớp với user.id
**Nguyên nhân**: employerId trong subscription khác với user.id khi login

**Giải pháp**: Đảm bảo sử dụng cùng một identifier (email hoặc userId)

#### Issue 3: Notification được tạo nhưng không hiển thị
**Nguyên nhân**: 
- recipientRole không đúng
- recipientId không khớp với user.id

**Giải pháp**: Kiểm tra query filter trong `NotificationsSidebar.jsx`

### 7. ✅ Verification Checklist

Sau khi duyệt gói, kiểm tra:

- [ ] Console log hiển thị "✅ Notification sent to employer successfully"
- [ ] Alert hiển thị "✅ Đã duyệt gói và gửi thông báo cho Employer thành công!"
- [ ] DynamoDB Notifications table có record mới với:
  - `recipientRole: "employer"`
  - `recipientId: "employer@example.com"`
  - `type: "package_approved"`
  - `read: false`
- [ ] Employer Dashboard sidebar hiển thị thông báo mới
- [ ] Employer Notifications page hiển thị thông báo
- [ ] Click thông báo → navigate to `/employer/subscription`
- [ ] Thông báo được mark as read sau khi click

### 8. 🔧 Quick Fix Script

Nếu cần tạo thông báo cho các gói đã duyệt trước đó:

```javascript
// Run in Admin Console
const API_ENDPOINT = 'https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com';

// Get all approved subscriptions
const response = await fetch('https://p0nd7frlhg.execute-api.ap-southeast-1.amazonaws.com/subscriptions');
const subscriptions = await response.json();

// Create notifications for approved packages
for (const sub of subscriptions) {
  if (sub.status === 'active' && sub.employerId) {
    const notification = {
      type: 'package_approved',
      title: 'Gói dịch vụ đã được kích hoạt',
      titleEn: 'Package Activated',
      message: `Gói ${sub.packageName} (${sub.duration}) của bạn đã được admin phê duyệt và kích hoạt thành công!`,
      messageEn: `Your ${sub.packageName} package (${sub.duration}) has been approved and activated!`,
      recipientId: sub.employerId,
      recipientRole: 'employer',
      senderId: 'admin',
      senderName: 'Admin',
      data: {
        subscriptionId: sub.subscriptionId,
        packageName: sub.packageName,
        duration: sub.duration,
        expiryDate: sub.expiryDate
      },
      icon: 'check-circle',
      color: '#10b981',
      actionUrl: '/employer/subscription',
      actionText: 'Xem gói của tôi',
      actionTextEn: 'View My Packages'
    };
    
    await fetch(`${API_ENDPOINT}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification)
    });
    
    console.log(`✅ Created notification for ${sub.employerId}`);
  }
}
```

---

## 📊 Expected Flow

```
1. Employer mua gói
   ↓
2. Subscription được tạo với status="pending", employerId="employer@example.com"
   ↓
3. Admin vào /admin/packages → tab "Chờ duyệt"
   ↓
4. Admin click "Duyệt"
   ↓
5. API PUT /subscriptions/{id} → status="active"
   ↓
6. API GET /subscriptions/{id} → lấy employerId
   ↓
7. createPackageApprovedNotification(subscription, employerId)
   ↓
8. API POST /notifications → tạo notification với recipientRole="employer"
   ↓
9. Employer Dashboard auto-refresh (10s) → load notifications
   ↓
10. Employer thấy thông báo mới trong sidebar
```

---

## 🎯 Next Steps

1. **Mở Console và duyệt một gói** → Xem log
2. **Gửi screenshot Console log** nếu có lỗi
3. **Kiểm tra DynamoDB** xem subscription có employerId không
4. **Test với Employer account** xem có nhận thông báo không

