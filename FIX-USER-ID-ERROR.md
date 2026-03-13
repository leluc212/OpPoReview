# 🔧 Fix "User ID not found" Error

## Vấn đề
Lỗi "User ID not found. Please login again." xuất hiện khi:
- User object trong localStorage không có `userId`
- User đã login trước khi code được cập nhật
- Session Cognito hợp lệ nhưng localStorage bị lỗi

## Giải pháp đã áp dụng

### 1. ✅ Cập nhật AuthContext
File: `src/context/AuthContext.jsx`

**Thay đổi:**
- Luôn lấy `userId` từ Cognito token (`session.tokens.idToken.payload.sub`)
- Override userId trong localStorage với giá trị từ token
- Đảm bảo email và username cũng được sync từ Cognito

**Code:**
```javascript
const userIdFromToken = session.tokens.idToken.payload.sub;
const emailFromToken = session.tokens.idToken.payload.email;

// Override với giá trị từ token
userData.userId = userIdFromToken;
userData.email = emailFromToken;
userData.username = currentUser.username;
```

### 2. ✅ Cập nhật CVUpload Component
File: `src/components/CVUpload.jsx`

**Thay đổi:**
- Thêm loading state khi đang check auth
- Hiển thị thông báo rõ ràng khi không có userId
- Hướng dẫn user đăng xuất và đăng nhập lại

**UI States:**
1. `isLoading` → "Đang tải thông tin người dùng..."
2. `!user?.userId` → "Không tìm thấy thông tin người dùng. Vui lòng đăng xuất và đăng nhập lại."
3. Normal → Upload CV interface

## Cách test

### Option 1: Sử dụng Debug Tool
1. Mở file `test-auth-debug.html` trong browser
2. Kiểm tra:
   - ✅ LocalStorage có userId không?
   - ✅ Cognito session có userId không?
3. Nếu thiếu userId, click "🔧 Fix User ID"
4. Refresh trang ứng dụng

### Option 2: Manual Fix
1. Đăng xuất khỏi ứng dụng
2. Xóa localStorage: `localStorage.clear()`
3. Đăng nhập lại
4. AuthContext sẽ tự động tạo user object mới với userId từ Cognito

### Option 3: Console Fix
Mở Console và chạy:
```javascript
// Check current user
const user = JSON.parse(localStorage.getItem('user'));
console.log('Current user:', user);

// If missing userId, you need to re-login
if (!user?.userId) {
  console.log('❌ Missing userId - please logout and login again');
}
```

## Kiểm tra sau khi fix

1. **Mở Console** và check logs:
```
✅ [AuthContext] Cognito user found: [username]
✅ [AuthContext] Session tokens: Present
✅ [AuthContext] Restored user from localStorage: [email] Role: [role] UserId: [userId]
```

2. **Trong CVUpload component:**
```
🔍 [CVUpload] useEffect triggered
✅ [CVUpload] User ID found, loading CV info...
```

3. **Không còn lỗi:**
- ❌ "User ID not found. Please login again."
- ✅ CV upload interface hiển thị bình thường

## Nguyên nhân gốc rễ

### Trước khi fix:
```javascript
// localStorage có thể có user object cũ
{
  "email": "user@example.com",
  "role": "candidate",
  // ❌ Thiếu userId
}
```

### Sau khi fix:
```javascript
// AuthContext luôn sync userId từ Cognito token
{
  "username": "user123",
  "userId": "abc-123-def-456",  // ✅ Từ token
  "email": "user@example.com",   // ✅ Từ token
  "role": "candidate",
  "approved": true
}
```

## Lưu ý quan trọng

1. **userId luôn đến từ Cognito token** (`sub` claim)
2. **Không thể thay đổi userId** - nó là unique identifier từ Cognito
3. **Email cũng đến từ Cognito** - đã được verify
4. **Nếu vẫn lỗi** → User cần logout và login lại để refresh session

## Files đã thay đổi

- ✅ `src/context/AuthContext.jsx` - Sync userId từ token
- ✅ `src/components/CVUpload.jsx` - Better error handling
- ✅ `test-auth-debug.html` - Debug tool (NEW)
- ✅ `FIX-USER-ID-ERROR.md` - Documentation (NEW)

## Next Steps

Nếu user vẫn gặp lỗi:
1. Check Cognito session có hợp lệ không
2. Verify token có `sub` claim không
3. Check network requests đến API
4. Xem Lambda logs để debug backend
