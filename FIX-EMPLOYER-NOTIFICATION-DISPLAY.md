# 🔧 Fix: Employer Notification Not Displaying

## 🐛 Problem

Notifications were being saved to database correctly with `recipientId = employerId` (Cognito sub), but **Navbar and NotificationsSidebar were using wrong userId** to query notifications.

### Root Cause

- **Database**: Notifications have `recipientId = "d96ad50c-a041-709e-d8e0-7128ee65eac2"` (Cognito sub / employerId)
- **Navbar/Sidebar**: Were using `user.id` or `user.email` instead of `user.userId`
- **AuthContext**: User object has `userId` field (from Cognito sub), not `id`

```javascript
// AuthContext.jsx (line 96)
const userData = {
  username: currentUser.username,
  userId: session.tokens.idToken.payload.sub,  // ← This is the employerId!
  email: session.tokens.idToken.payload.email,
  role: userRole,
  approved: true
};
```

But Navbar was doing:
```javascript
// WRONG ❌
const userId = user.role === 'admin' ? 'admin' : user.id || user.email;

// CORRECT ✅
const userId = user.role === 'admin' ? 'admin' : (user.userId || user.id || user.email);
```

## ✅ Solution

### 1. Fixed `Navbar.jsx`
Changed line 502 from:
```javascript
const userId = user.role === 'admin' ? 'admin' : user.id || user.email;
```

To:
```javascript
const userId = user.role === 'admin' ? 'admin' : (user.userId || user.id || user.email);
```

Added detailed logging:
```javascript
console.log('🔔 Loading notifications for:', { userId, role: user.role, userObject: user });
```

### 2. Fixed `NotificationsSidebar.jsx`
Changed line 235 from:
```javascript
const userId = user.role === 'admin' ? 'admin' : user.id || user.email;
```

To:
```javascript
const userId = user.role === 'admin' ? 'admin' : (user.userId || user.id || user.email);
```

Added detailed logging:
```javascript
console.log('🔔 [NotificationsSidebar] Loading notifications for:', { userId, role, userObject: user });
```

## 🧪 How to Test

### Method 1: Check Console Logs

1. **Login as Employer** (the one who purchased a package)
2. **Open Console (F12)**
3. Look for logs:
   ```
   🔔 Loading notifications for: { userId: 'd96ad50c-a041-709e-d8e0-7128ee65eac2', role: 'employer', userObject: {...} }
   📥 Received notifications: [...]
   📊 Notifications count: X
   📬 Unread count: X
   ```
4. **Check Navbar** - should see notification badge with count
5. **Click Bell Icon** - should see package_approved notifications

### Method 2: Verify Database Match

**Step 1: Get employerId from user object**
- Login as Employer
- Open Console
- Type: `JSON.parse(localStorage.getItem('user')).userId`
- Copy the userId (e.g., `d96ad50c-a041-709e-d8e0-7128ee65eac2`)

**Step 2: Check notifications in database**
```powershell
$employerId = "d96ad50c-a041-709e-d8e0-7128ee65eac2"  # Replace with actual
$response = Invoke-WebRequest -Uri "https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com/notifications?recipientId=$employerId&recipientRole=employer" -Method GET -UseBasicParsing
$notifications = $response.Content | ConvertFrom-Json
Write-Host "Found $($notifications.Count) notifications"
$notifications | Where-Object { $_.type -eq 'package_approved' } | ForEach-Object {
    Write-Host "[$($_.type)] $($_.title) - Created: $($_.createdAt)"
}
```

**Step 3: Verify match**
- The `employerId` from Step 1 should match `recipientId` in notifications from Step 2
- Navbar should now display these notifications

### Method 3: Complete Flow Test

1. **As Employer**: Purchase a package
2. **As Admin**: Approve the package (check console logs)
3. **As Employer**: 
   - Logout and login again
   - Check Navbar for notification badge
   - Click bell icon to see notification
   - Should see: "Gói dịch vụ đã được kích hoạt"

## 🎯 Expected Behavior

After fix:
- ✅ Navbar uses `user.userId` (Cognito sub) to query notifications
- ✅ NotificationsSidebar uses `user.userId` to query notifications
- ✅ Employer sees package_approved notifications in Navbar
- ✅ Notification badge shows correct unread count
- ✅ Clicking notification redirects to `/employer/subscription`

## 📝 Files Modified

1. `src/components/Navbar.jsx` - Fixed userId extraction (line 502)
2. `src/components/NotificationsSidebar.jsx` - Fixed userId extraction (line 235)
3. `dist/` - Rebuilt with fixes

## 🔍 Debug Checklist

If notifications still don't show:

1. **Check user object in console**
   ```javascript
   console.log(JSON.parse(localStorage.getItem('user')))
   ```
   - Should have `userId` field
   - `userId` should be a UUID (Cognito sub)

2. **Check Navbar console logs**
   ```
   🔔 Loading notifications for: { userId: '...', role: 'employer', userObject: {...} }
   ```
   - `userId` should match the employerId in database
   - If `userId` is email instead of UUID, there's a problem with AuthContext

3. **Check notification in database**
   - Use PowerShell command above
   - Verify `recipientId` matches `userId` from step 1
   - Verify `recipientRole` is `'employer'`

4. **Check API call in Network tab**
   - Filter by "notifications"
   - Look for GET request with query params
   - Verify `recipientId` parameter matches `userId`

## ✅ Conclusion

The issue was a **mismatch between userId used in frontend vs recipientId in database**:
- Database uses `employerId` (Cognito sub) as `recipientId`
- Frontend was using `user.id` (undefined) or `user.email` instead of `user.userId`
- Fix: Use `user.userId` which contains the Cognito sub (employerId)

**Now employer notifications should display correctly!**
