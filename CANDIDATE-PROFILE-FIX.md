# Fix: Candidate Profile & Auto Logout Issue

## Vấn đề đã sửa

### 1. Trang "Hồ sơ của tôi" không hiển thị dữ liệu
- **Nguyên nhân:** API Gateway chưa có CORS headers đầy đủ cho OPTIONS methods
- **Giải pháp:** 
  - Đã cấu hình CORS cho tất cả OPTIONS methods trên `/`, `/profile`, `/profile/{userId}`
  - Đã deploy API Gateway với CORS headers đầy đủ
  - API Lambda đang hoạt động tốt và trả về dữ liệu từ DynamoDB

### 2. Đăng xuất tự động khi F5 (refresh trang)
- **Nguyên nhân:** AuthContext chỉ kiểm tra localStorage mà không verify Cognito session
- **Giải pháp:**
  - Cập nhật `AuthContext.jsx` để kiểm tra Cognito session khi mount
  - Thêm `isLoading` state để hiển thị loading khi đang check auth
  - Cập nhật `App.jsx` để hiển thị loading state

## Các file đã thay đổi

1. **src/context/AuthContext.jsx**
   - Thêm import `getCurrentUser`, `fetchAuthSession` từ aws-amplify/auth
   - Thêm `isLoading` state
   - Thêm `useEffect` để check Cognito session khi mount
   - Verify session với Cognito trước khi set authenticated state

2. **src/App.jsx**
   - Thêm loading check trong `AppRoutes`
   - Hiển thị "Đang tải..." khi đang check auth

## Cách test

### Test API (không cần git push)
1. Clear cache trình duyệt (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Mở trang: https://leluc213.github.io/OpPoReview/candidate/profile
4. Hoặc mở file `test-candidate-profile-api.html` trong trình duyệt

### Test Auto Logout Fix (cần git push)
1. Build project: `npm run build`
2. Commit và push lên GitHub
3. Đợi GitHub Pages deploy (2-3 phút)
4. Đăng nhập vào trang
5. Nhấn F5 để refresh
6. Kiểm tra xem có còn đăng nhập không

## Lệnh deploy

```bash
# Build project
npm run build

# Commit changes
git add .
git commit -m "Fix: Candidate profile CORS & auto logout on refresh"
git push origin main
```

## Kết quả mong đợi

1. ✅ Trang "Hồ sơ của tôi" hiển thị dữ liệu từ DynamoDB
2. ✅ Không bị đăng xuất khi F5 (refresh trang)
3. ✅ Hiển thị loading state khi đang check authentication
4. ✅ Session được persist đúng cách với Cognito

## Dữ liệu test

- **User ID:** 296aa58c-30a1-70cc-44ed-b829e33a8245
- **Email:** leluc2200@gmail.com
- **Tên:** Lê Tấn Lực
- **Bảng:** CandidateProfiles (DynamoDB)
- **API:** https://xyp4wkszi7.execute-api.ap-southeast-1.amazonaws.com/prod
