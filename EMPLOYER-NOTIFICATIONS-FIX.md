# Fix: Employer Notifications Cần Reload Mới Hiển Thị

## Vấn đề
Mỗi lần vào trang notifications của employer, phải reload trang mới thấy được thông báo. Trong khi trang Admin thì không cần reload.

## Nguyên nhân chính

### **ROOT CAUSE: userId Mismatch**
- **User object có `userId` là email** (`quangnam@18096.edu.vn`) - từ localStorage cũ
- **Notifications trong DB có `recipientId` là UUID** (`f99a05cc-3011-7065-81ee-c97772e7629c`) - từ Cognito
- **API filter không match** → Trả về 0 notifications

### Chi tiết:
1. AuthContext đã được update để lưu UUID từ Cognito `sub`
2. Nhưng user đã login trước khi code được update
3. localStorage vẫn còn userId cũ (email)
4. Khi load notifications, code dùng email để query API
5. API không tìm thấy notifications nào với email đó

### Các vấn đề phụ:
1. **Function Hoisting**: `loadNotifications()` được gọi trong `useEffect` TRƯỚC KHI nó được định nghĩa
2. **Missing Dependencies**: `useEffect` dependency array thiếu `language`
3. **Không có Loading State**: Người dùng không biết là đang load notifications
4. **Polling Interval**: Chưa tối ưu

## Giải pháp đã áp dụng

### 1. **Migration Check - Auto-fix userId**
```javascript
const loadNotifications = async () => {
  let userId = user.userId || user.id;
  
  // If userId looks like an email, fetch the real UUID from Cognito
  if (userId && userId.includes('@')) {
    console.warn('⚠️ userId is email, fetching UUID from Cognito...');
    const { fetchAuthSession } = await import('aws-amplify/auth');
    const session = await fetchAuthSession();
    if (session && session.tokens) {
      const uuidFromToken = session.tokens.idToken.payload.sub;
      userId = uuidFromToken;
      
      // Update localStorage
      const updatedUser = { ...user, userId: uuidFromToken };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }
  
  const notifs = await getNotifications(userId, role);
  // ...
};
```

### 2. **Sắp xếp lại code**
```javascript
// ✅ ĐÚNG: Định nghĩa function TRƯỚC khi sử dụng
const loadNotifications = async () => { ... };

useEffect(() => {
  loadNotifications(); // Gọi sau khi đã định nghĩa
}, [user, language]);
```

### 3. **Thêm Loading State**
```javascript
const [loading, setLoading] = useState(true);

// Hiển thị spinner khi đang load
{loading ? (
  <LoadingState>
    <div className="spinner"></div>
    <p>Đang tải thông báo...</p>
  </LoadingState>
) : ...}
```

### 4. **Cải thiện Polling Strategy**
```javascript
useEffect(() => {
  // Load ngay lập tức
  loadNotifications();
  
  // Poll mỗi 5 giây (cân bằng giữa real-time và server load)
  const interval = setInterval(loadNotifications, 5000);
  
  // Listen for storage events
  window.addEventListener('storage', handleStorageChange);
  
  // Listen for tab focus (reload khi user quay lại tab)
  window.addEventListener('focus', handleFocus);
  
  return () => {
    clearInterval(interval);
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('focus', handleFocus);
  };
}, [user, language]); // ✅ Thêm language vào dependencies
```

## Kết quả

### Trước khi fix:
- ❌ Vào trang → Trang trống
- ❌ Phải reload → Mới thấy notifications
- ❌ Không biết đang load hay không có dữ liệu
- ❌ userId là email → API không tìm thấy notifications

### Sau khi fix:
- ✅ Vào trang → Hiển thị loading spinner
- ✅ Auto-detect email và fetch UUID từ Cognito
- ✅ Notifications load ngay lập tức
- ✅ Auto-refresh mỗi 5 giây
- ✅ Reload khi focus lại tab
- ✅ Reload khi có storage event (notification mới)

## Testing

### Test Cases
1. ✅ User có userId là email → Auto-fix thành UUID
2. ✅ User có userId là UUID → Dùng luôn
3. ✅ Vào trang lần đầu → Hiển thị loading → Hiển thị notifications
4. ✅ Không có notifications → Hiển thị empty state
5. ✅ Có lỗi API → Hiển thị empty state (không crash)
6. ✅ Đổi ngôn ngữ → Notifications reload với ngôn ngữ mới
7. ✅ Chuyển tab khác rồi quay lại → Notifications reload
8. ✅ Có notification mới → Auto-refresh sau 5 giây

### Cách test
```bash
# 1. Start dev server
npm run dev

# 2. Login as employer (có thể là user cũ với email trong localStorage)
# 3. Vào trang /employer/notifications
# 4. Quan sát console:
#    - Nếu userId là email → Sẽ thấy warning và auto-fix
#    - Loading spinner hiển thị ngay
#    - Notifications load trong vài giây
# 5. Check localStorage:
#    - userId đã được update thành UUID
```

## Files đã thay đổi

### `src/pages/employer/EmployerNotifications.jsx`
- ✅ Di chuyển `loadNotifications` lên trước `useEffect`
- ✅ Thêm migration check: auto-fix email → UUID
- ✅ Thêm `language` vào dependency array
- ✅ Thêm loading state và spinner
- ✅ Thêm focus event listener
- ✅ Tăng polling interval từ 3s → 5s
- ✅ Xử lý edge cases (no user, error)

### `src/components/Navbar.jsx`
- ✅ Thêm migration check: auto-fix email → UUID
- ✅ Đảm bảo userId luôn là UUID khi query API

## Notes

### Performance
- Polling mỗi 5 giây là cân bằng tốt giữa real-time và server load
- Focus event listener giúp reload khi user quay lại tab
- Storage event listener giúp sync giữa các tabs
- Migration check chỉ chạy 1 lần khi detect email

### Security
- UUID từ Cognito token luôn được ưu tiên
- Không bao giờ dùng email để query notifications
- localStorage được update tự động với UUID mới

### Future Improvements
- Có thể thêm WebSocket để real-time notifications
- Có thể thêm retry logic khi API fail
- Có thể cache notifications trong localStorage để load nhanh hơn
- Có thể thêm migration script để update tất cả users cùng lúc

## Debugging

### Nếu vẫn không thấy notifications:

1. **Check console logs:**
   ```
   🔔 Loading notifications for: {userId: "xxx", role: "employer"}
   📥 Received notifications: 0
   ```
   - Nếu userId vẫn là email → Migration check failed
   - Nếu userId là UUID nhưng vẫn 0 notifications → Check API

2. **Check localStorage:**
   ```javascript
   JSON.parse(localStorage.getItem('user'))
   // Should have: { userId: "f99a05cc-3011-7065-81ee-c97772e7629c", ... }
   ```

3. **Test API trực tiếp:**
   ```bash
   curl "https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com/notifications?recipientId=<UUID>&recipientRole=employer"
   ```

4. **Check Cognito token:**
   ```javascript
   import { fetchAuthSession } from 'aws-amplify/auth';
   const session = await fetchAuthSession();
   console.log('Cognito sub:', session.tokens.idToken.payload.sub);
   ```

## Conclusion

Vấn đề đã được fix hoàn toàn với migration check tự động. Employer notifications giờ đây:
- Load ngay lập tức khi vào trang
- Tự động fix userId từ email → UUID
- Không cần logout/login lại
- Hoạt động mượt mà như Admin dashboard
