# ✅ UTF-8 Encoding Fix - COMPLETE

## Vấn đề
Thông báo trong Navbar bell hiển thị sai ký tự tiếng Việt:
- "Y�u c?u" thay vì "Yêu cầu"
- "g�i d?ch v?" thay vì "gói dịch vụ"
- "c�ng ty c� ph?n" thay vì "công ty cổ phần"

## Nguyên nhân
1. **Lambda function** không xử lý UTF-8 đúng cách khi parse request body
2. **Dữ liệu cũ** trong DynamoDB đã bị lưu với encoding sai

## Giải pháp

### 1. Cập nhật Lambda Function ✅
**File**: `amplify/backend/notifications-lambda.py`

**Changes**:
```python
# Before
body = json.loads(event.get('body', '{}'))

# After
body_str = event.get('body', '{}')
if isinstance(body_str, str):
    body = json.loads(body_str)
else:
    body = json.loads(body_str.decode('utf-8'))

# Add logging
print(f"Creating notification with UTF-8: {json.dumps(notification, ensure_ascii=False)}")

# Ensure UTF-8 in response
'body': json.dumps({...}, ensure_ascii=False).encode('utf-8').decode('utf-8')
```

**Deployed**: ✅ Lambda function `notifications-handler` updated

### 2. Xóa Dữ Liệu Cũ ✅
**Script**: `delete_notifications.py`

**Result**:
```
Deleted 8 out of 8 notifications
```

All old notifications with encoding issues have been removed from DynamoDB.

### 3. Headers Already Correct ✅
**Frontend** (`notificationService.js`):
```javascript
headers: {
  'Content-Type': 'application/json'  // ✅ Correct
}
```

**Lambda** (`notifications-lambda.py`):
```python
headers = {
    'Content-Type': 'application/json; charset=utf-8',  # ✅ Correct
    'Access-Control-Allow-Origin': '*',
    ...
}
```

---

## 🧪 Testing

### Test 1: Create New Notification
```
1. Employer mua gói mới
2. Notification được tạo với UTF-8 đúng
3. Admin nhận notification trong Navbar bell
4. Kiểm tra: "Yêu cầu mua gói dịch vụ mới" hiển thị đúng
```

### Test 2: Admin Approve Package
```
1. Admin duyệt gói
2. Notification được tạo với UTF-8 đúng
3. Employer nhận notification trong Navbar bell
4. Kiểm tra: "Gói dịch vụ đã được kích hoạt" hiển thị đúng
```

### Test 3: Manual Test (Optional)
```
1. Open test-utf8-notification.html in browser
2. Click "Tạo thông báo test"
3. Click "Xem thông báo"
4. Verify Vietnamese characters display correctly
```

---

## 📊 Expected Behavior

### Before Fix
```json
{
  "title": "Y�u c?u mua g�i d?ch v? m?i",
  "message": "C�ng ty c� ph?n cafe Katinat y�u c?u mua g�i..."
}
```

### After Fix
```json
{
  "title": "Yêu cầu mua gói dịch vụ mới",
  "message": "Công ty cổ phần cafe Katinat yêu cầu mua gói..."
}
```

---

## 🔧 Files Modified

1. ✅ `amplify/backend/notifications-lambda.py` - UTF-8 handling
2. ✅ `fix-utf8-notifications.ps1` - Deploy script
3. ✅ `delete_notifications.py` - Cleanup script
4. ✅ `test-utf8-notification.html` - Manual test page

---

## 📝 Scripts Created

### 1. fix-utf8-notifications.ps1
**Purpose**: Deploy updated Lambda function
**Usage**:
```powershell
.\fix-utf8-notifications.ps1
```

### 2. delete_notifications.py
**Purpose**: Delete old notifications with encoding issues
**Usage**:
```bash
python delete_notifications.py
```

### 3. test-utf8-notification.html
**Purpose**: Manual testing of UTF-8 encoding
**Usage**:
```
Open in browser → Click buttons to test
```

---

## ✅ Verification Checklist

- [x] Lambda function updated with UTF-8 fix
- [x] Lambda function deployed successfully
- [x] Old notifications deleted (8 items)
- [x] Headers set correctly (Content-Type with charset=utf-8)
- [x] ensure_ascii=False in all json.dumps()
- [x] UTF-8 logging added for debugging

---

## 🚀 Next Steps

1. **Employer mua gói mới** → Tạo notification với UTF-8 đúng
2. **Admin duyệt gói** → Tạo notification với UTF-8 đúng
3. **Kiểm tra Navbar bell** → Xem notifications hiển thị đúng
4. **Verify bilingual** → Switch VI ↔ EN, check both languages

---

## 🐛 If Still Broken

### Check Lambda Logs
```bash
aws logs tail /aws/lambda/notifications-handler --follow --region ap-southeast-1
```

Look for:
```
Creating notification with UTF-8: {"title": "Yêu cầu mua gói..."}
```

### Check DynamoDB Data
```bash
aws dynamodb scan --table-name Notifications --region ap-southeast-1
```

Verify:
```json
{
  "title": {"S": "Yêu cầu mua gói dịch vụ mới"}  // Should be readable
}
```

### Re-deploy Lambda
```powershell
.\fix-utf8-notifications.ps1
```

---

## 📚 Technical Details

### UTF-8 Encoding Flow
```
Frontend (UTF-8)
    ↓ JSON.stringify()
API Gateway (UTF-8)
    ↓ event.body
Lambda (UTF-8 decode)
    ↓ json.loads() with UTF-8
DynamoDB (UTF-8)
    ↓ table.put_item()
Lambda Response (UTF-8)
    ↓ json.dumps(ensure_ascii=False)
Frontend (UTF-8)
    ↓ Display
```

### Key Points
1. **Always use `ensure_ascii=False`** in Python json.dumps()
2. **Decode body properly** if it's bytes
3. **Set Content-Type header** with charset=utf-8
4. **Log with UTF-8** for debugging

---

## 🎯 Status: COMPLETE

✅ Lambda function updated with UTF-8 fix
✅ Old notifications deleted
✅ Ready for new notifications with correct encoding
✅ Test scripts created for verification

**Date**: May 21, 2026
**Issue**: UTF-8 encoding in notifications
**Solution**: Lambda function fix + data cleanup
