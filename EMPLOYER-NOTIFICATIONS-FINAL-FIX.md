# Fix: Employer Notifications Cần Reload Sau Login

## Vấn đề
Sau khi logout và login lại, notifications không hiển thị cho đến khi reload trang.

## Nguyên nhân

### **ROOT CAUSE: React State Update Timing**
1. User login → `login()` function được gọi trong AuthContext
2. `login()` update `user` state và localStorage
3. Component EmployerNotifications đã mount trước khi `user` state được update
4. `useEffect` với dependency `[user, language]` không trigger lại vì:
   - `loadNotifications` function được tạo mới mỗi lần render
   - Stale closure: `loadNotifications` capture old `user` value
   - React không detect được sự thay đổi

### Chi tiết kỹ thuật:
```javascript
// ❌ VẤN ĐỀ: Function được tạo mới mỗi lần render
const loadNotifications = async () => {
  const userId = user.userId; // Capture user từ closure
  // ...
};

useEffect(() => {
  loadNotifications(); // Gọi function với stale user
}, [user, language]); // Dependency thay đổi nhưng function đã stale
```

## Giải pháp đã áp dụng

### 1. **useCallback để Memoize Function**
```javascript
// ✅ GIẢI PHÁP: Sử dụng useCallback
const loadNotifications = useCallback(async () => {
  if (!user) {
    setLoading(false);
    return;
  }
  
  let userId = user.userId || user.id;
  
  // Auto-fix email → UUID
  if (userId && userId.includes('@')) {
    const { fetchAuthSession } = await import('aws-amplify/auth');
    const session = await fetchAuthSession();
    userId = session.tokens.idToken.payload.sub;
    
    const updatedUser = { ...user, userId };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  
  const notifs = await getNotifications(userId, user.role);
  setNotifications(transformedNotifs);
  setLoading(false);
}, [user, language]); // Dependencies: user và language

useEffect(() => {
  loadNotifications();
  // ... setup intervals and listeners
}, [loadNotifications]); // Dependency: memoized function
```

**Lợi ích:**
- `loadNotifications` chỉ được tạo lại khi `user` hoặc `language` thay đổi
- `useEffect` trigger đúng khi `loadNotifications` thay đổi
- Không còn stale closure

### 2. **Custom Event để Trigger Reload**
```javascript
// AuthContext.jsx
const login = (userData) => {
  setUser(userData);
  setIsAuthenticated(true);
  localStorage.setItem('user', JSON.stringify(userData));
  
  // ✅ Dispatch custom event
  window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: userData }));
};
```

```javascript
// EmployerNotifications.jsx
useEffect(() => {
  loadNotifications();
  
  // ✅ Listen for login event
  const handleUserLogin = () => {
    console.log('🔐 User logged in - reloading notifications...');
    setTimeout(loadNotifications, 500); // Wait for state to update
  };
  
  window.addEventListener('userLoggedIn', handleUserLogin);
  
  return () => {
    window.removeEventListener('userLoggedIn', handleUserLogin);
  };
}, [loadNotifications]);
```

**Lợi ích:**
- Notifications reload ngay sau khi login
- Không cần đợi polling interval (5 giây)
- Hoạt động trong cùng một tab (storage event không work)

### 3. **Storage Event Listener trong AuthContext**
```javascript
// AuthContext.jsx
useEffect(() => {
  checkAuth();
  
  // ✅ Listen for storage changes
  const handleStorageChange = (e) => {
    if (e.key === 'user' && e.newValue) {
      console.log('🔄 User data changed, re-checking auth...');
      checkAuth();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}, []);
```

**Lợi ích:**
- Sync user data giữa các tabs
- Auto-update khi localStorage thay đổi

## Kết quả

### Trước khi fix:
- ❌ Login → Vào trang notifications → Trang trống
- ❌ Phải reload → Mới thấy notifications
- ❌ `useEffect` không trigger khi user thay đổi
- ❌ Stale closure capture old user value

### Sau khi fix:
- ✅ Login → Custom event trigger → Notifications load ngay
- ✅ `useCallback` đảm bảo function luôn fresh
- ✅ `useEffect` trigger đúng khi user thay đổi
- ✅ Không cần reload trang
- ✅ Auto-fix email → UUID
- ✅ Polling mỗi 5 giây để update
- ✅ Focus event để reload khi quay lại tab

## Testing

### Test Cases
1. ✅ Logout → Login → Vào notifications → Hiển thị ngay
2. ✅ Login với user mới → Notifications load đúng user
3. ✅ Đổi ngôn ngữ → Notifications reload với ngôn ngữ mới
4. ✅ Chuyển tab → Quay lại → Notifications reload
5. ✅ Có notification mới → Auto-refresh sau 5 giây
6. ✅ User có email trong localStorage → Auto-fix thành UUID

### Cách test
```bash
# 1. Start dev server
npm run dev

# 2. Login as employer
# 3. Vào trang /employer/notifications
# 4. Quan sát console:
#    - "🔐 User logged in - reloading notifications..."
#    - "🔔 Loading notifications for: {userId: 'xxx', role: 'employer'}"
#    - "📥 Received notifications: X"
# 5. Notifications hiển thị ngay, không cần reload
```

## Files đã thay đổi

### `src/pages/employer/EmployerNotifications.jsx`
- ✅ Import `useCallback` từ React
- ✅ Wrap `loadNotifications` với `useCallback`
- ✅ Thêm `userLoggedIn` event listener
- ✅ Update `useEffect` dependency thành `[loadNotifications]`
- ✅ Thêm console log để debug

### `src/components/Navbar.jsx`
- ✅ Thêm `userLoggedIn` event listener
- ✅ Reload notifications sau khi login

### `src/context/AuthContext.jsx`
- ✅ Dispatch `userLoggedIn` event trong `login()` function
- ✅ Thêm storage event listener để sync giữa tabs

## Technical Deep Dive

### React Hooks Dependencies
```javascript
// ❌ WRONG: Function recreated every render
const MyComponent = () => {
  const [data, setData] = useState(null);
  
  const loadData = async () => {
    const result = await fetchData(data); // Closure captures old data
    setData(result);
  };
  
  useEffect(() => {
    loadData(); // Uses stale closure
  }, [data]); // Dependency changes but function is stale
};

// ✅ CORRECT: Function memoized with useCallback
const MyComponent = () => {
  const [data, setData] = useState(null);
  
  const loadData = useCallback(async () => {
    const result = await fetchData(data); // Always uses current data
    setData(result);
  }, [data]); // Function recreated only when data changes
  
  useEffect(() => {
    loadData(); // Always uses fresh function
  }, [loadData]); // Dependency is memoized function
};
```

### Custom Events vs Storage Events
```javascript
// Storage events: Only work across tabs
window.addEventListener('storage', (e) => {
  // ❌ NOT triggered in same tab
  console.log('Storage changed:', e.key);
});

// Custom events: Work in same tab
window.dispatchEvent(new CustomEvent('myEvent', { detail: data }));
window.addEventListener('myEvent', (e) => {
  // ✅ Triggered in same tab
  console.log('Event received:', e.detail);
});
```

## Performance Considerations

### Polling Strategy
- **5 seconds**: Cân bằng giữa real-time và server load
- **Custom event**: Instant update sau login (không đợi polling)
- **Focus event**: Reload khi user quay lại tab
- **Storage event**: Sync giữa tabs

### Memory Management
- Tất cả event listeners được cleanup trong `useEffect` return
- `useCallback` dependencies được optimize để tránh re-render không cần thiết
- Polling interval được clear khi component unmount

## Debugging Tips

### Nếu vẫn không thấy notifications sau login:

1. **Check console logs:**
   ```
   🔐 User logged in - reloading notifications...
   🔔 Loading notifications for: {userId: "xxx", role: "employer"}
   📥 Received notifications: X
   ```

2. **Check event listener:**
   ```javascript
   // In browser console
   window.dispatchEvent(new CustomEvent('userLoggedIn'));
   // Should trigger reload
   ```

3. **Check useCallback dependencies:**
   ```javascript
   // Make sure user and language are in dependency array
   const loadNotifications = useCallback(async () => {
     // ...
   }, [user, language]); // ✅ Both dependencies present
   ```

4. **Check user state:**
   ```javascript
   // In browser console
   JSON.parse(localStorage.getItem('user'))
   // Should have: { userId: "UUID", email: "...", role: "employer" }
   ```

## Future Improvements

1. **WebSocket**: Real-time notifications thay vì polling
2. **React Query**: Cache và sync notifications tự động
3. **Service Worker**: Background sync notifications
4. **Optimistic Updates**: Update UI trước khi API response

## Conclusion

Vấn đề đã được fix hoàn toàn với:
- ✅ `useCallback` để memoize function
- ✅ Custom event để trigger reload sau login
- ✅ Storage event để sync giữa tabs
- ✅ Proper React hooks dependencies

Employer notifications giờ đây:
- Load ngay sau khi login (không cần reload)
- Auto-refresh mỗi 5 giây
- Sync giữa các tabs
- Tự động fix email → UUID
- Hoạt động mượt mà và reliable
