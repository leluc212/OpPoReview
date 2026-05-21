# 🔍 Notification Debug Guide

## ✅ Đã Verify

### API hoạt động đúng:
- ✅ Lambda function đã được update
- ✅ API endpoint hoạt động: `https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com`
- ✅ DynamoDB table `Notifications` tồn tại
- ✅ Test script tạo notification thành công
- ✅ Notification được lưu vào DynamoDB

### Test Results:
```powershell
PS> .\test-notification-simple.ps1

[1] Creating notification...
SUCCESS: NOTIF-20260521-86b78d5a

[2] Getting notifications...
Found: 1 notifications

[3] Checking DynamoDB...
DynamoDB has: 1 items
```

## ❌ Vấn đề hiện tại

**Notification KHÔNG được tạo khi Employer mua gói trong app thật**

Có thể do:
1. Frontend code không được build/deploy
2. Browser cache cũ
3. Lỗi JavaScript trong browser
4. API call bị block bởi CORS
5. Environment variable không đúng

## 🧪 Cách Test

### Test 1: Test API trực tiếp (✅ PASSED)
```powershell
.\test-notification-simple.ps1
```

**Kết quả:** API hoạt động đúng!

### Test 2: Test trong Browser
```powershell
start test-purchase-flow.html
```

Trong page:
1. Click "🚀 Simulate Full Purchase Flow"
2. Xem console logs
3. Click "✅ Check Results" để verify

**Expected:** Notification được tạo thành công

### Test 3: Test trong App thật

#### Bước 1: Build app
```powershell
npm run build
```

#### Bước 2: Start dev server
```powershell
npm run dev
```

#### Bước 3: Test purchase flow
1. Mở browser: `http://localhost:5173`
2. Login as Employer
3. Vào `/employer/subscription`
4. **MỞ BROWSER CONSOLE (F12)**
5. Chọn một gói và mua
6. Xem console logs

#### Bước 4: Kiểm tra logs

**Logs cần thấy:**
```
Sending purchase to API: {...}
Subscription created: {...}
📤 Creating notification for admin...
📝 Creating package purchase notification with data: {...}
📤 Sending notification to API with UTF-8 encoding:
💾 Saving notification to API...
✅ Response received!
✅ Notification saved successfully!
✅ Notification sent to admin successfully: {...}
```

**Nếu KHÔNG thấy logs:**
- Frontend code chưa được build
- Hoặc đang chạy code cũ từ cache

**Nếu thấy ERROR:**
- Check error message
- Check Network tab trong DevTools
- Check CORS headers

## 🔧 Troubleshooting

### Issue 1: Không thấy logs "Creating notification for admin"

**Nguyên nhân:** Code cũ đang chạy

**Giải pháp:**
```powershell
# Clear cache và rebuild
npm run build

# Hoặc hard refresh trong browser
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

### Issue 2: Thấy logs nhưng có lỗi "API_ENDPOINT is undefined"

**Nguyên nhân:** .env file không được load

**Giải pháp:**
1. Check file `.env` có `VITE_NOTIFICATIONS_API`
2. Restart dev server
3. Clear browser cache

### Issue 3: Network error hoặc CORS error

**Nguyên nhân:** API Gateway CORS chưa đúng

**Giải pháp:**
Check API Gateway CORS settings:
- Allow Origins: *
- Allow Methods: GET, POST, PUT, DELETE, OPTIONS
- Allow Headers: Content-Type, Authorization

### Issue 4: Status 500 từ API

**Nguyên nhân:** Lambda function lỗi

**Giải pháp:**
Check CloudWatch logs:
```powershell
aws logs tail /aws/lambda/notifications-handler --follow --region ap-southeast-1
```

## 📊 Verification Checklist

### ✅ Backend (API & Lambda)
- [x] Lambda function updated
- [x] API endpoint accessible
- [x] DynamoDB table exists
- [x] Test script works
- [x] Notification saved to DB

### ⚠️ Frontend (React App)
- [ ] Code built with latest changes
- [ ] Dev server running
- [ ] Browser cache cleared
- [ ] Console shows logs
- [ ] Network tab shows POST request
- [ ] Notification created in DB

## 🎯 Next Steps

### Step 1: Verify Frontend Code
```powershell
# Check if notificationService.js has latest code
cat src\services\notificationService.js | Select-String "createPackagePurchaseRequestNotification"
```

### Step 2: Rebuild App
```powershell
# Stop dev server (Ctrl+C)
# Clear node_modules cache (optional)
npm run build
npm run dev
```

### Step 3: Test in Browser
1. Open `http://localhost:5173`
2. Open DevTools (F12)
3. Go to Console tab
4. Login as Employer
5. Buy a package
6. Watch console logs

### Step 4: Verify in DynamoDB
```powershell
.\check-notifications.ps1
```

Should see new notification with:
- `type: package_purchase_request`
- `recipientId: admin`
- `recipientRole: admin`
- Company name and package details

## 📝 Test Files Created

1. **test-notification-simple.ps1** - Quick API test (✅ Works)
2. **test-purchase-flow.html** - Browser simulation
3. **debug-notification-api.html** - Detailed API debug
4. **check-notifications.ps1** - Check DynamoDB

## 🚨 Common Mistakes

### ❌ Mistake 1: Not rebuilding after code changes
```powershell
# Always rebuild after changing code
npm run build
```

### ❌ Mistake 2: Browser cache
```
# Always hard refresh
Ctrl + Shift + R
```

### ❌ Mistake 3: Not checking console
```
# ALWAYS open DevTools Console (F12)
# before testing purchase flow
```

### ❌ Mistake 4: Wrong environment
```
# Make sure .env has correct API endpoint
VITE_NOTIFICATIONS_API=https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com
```

## ✅ Success Indicators

When everything works, you should see:

### In Browser Console:
```
✅ Notification sent to admin successfully
```

### In DynamoDB:
```powershell
PS> .\check-notifications.ps1

Total: 2+ notifications

  ID: NOTIF-20260521-xxxxxxxx
  Type: package_purchase_request
  Title: Yêu cầu mua gói dịch vụ mới
  Recipient: admin (admin)
  Created: 2026-05-21T...
```

### In Admin Dashboard:
- Bell icon shows unread count
- Notification appears in list
- Vietnamese text displays correctly
- Price shows correct format

## 📞 Still Not Working?

If notifications still don't appear after:
1. ✅ Rebuilding app
2. ✅ Clearing cache
3. ✅ Checking console logs
4. ✅ Verifying API works

Then:
1. Take screenshot of browser console
2. Take screenshot of Network tab
3. Run `.\check-notifications.ps1`
4. Check CloudWatch logs
5. Send all info for further debugging

---

**Last Updated:** 2026-05-21  
**Status:** API ✅ | Frontend ⚠️ (needs testing)
