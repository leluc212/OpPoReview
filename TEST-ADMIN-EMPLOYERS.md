# Test Admin Employers Management

## ✅ Đã hoàn thành

1. ✅ Lambda function deployed với admin code
2. ✅ API Gateway route `/admin/employers` đã được tạo
3. ✅ Lambda integration đã được cấu hình
4. ✅ API đã deploy sang prod stage
5. ✅ Frontend đã được cập nhật để sử dụng API

## 🧪 Cách test

### 1. Chạy frontend
```bash
npm run dev
```

### 2. Đăng nhập với tài khoản admin
- Đảm bảo user có trong Cognito group "Admin"

### 3. Vào trang Quản lý Nhà tuyển dụng
- URL: http://localhost:5173/admin/employers

### 4. Kiểm tra
- ✓ Dữ liệu load từ DynamoDB (không phải JSON file)
- ✓ Nút "Làm mới" hoạt động
- ✓ Click "Duyệt" cập nhật status trong DynamoDB
- ✓ Stats hiển thị đúng

## 🔍 Debug

### Xem logs trong browser console
```javascript
// Mở DevTools > Console
// Bạn sẽ thấy:
// 📥 Fetching employer profiles from DynamoDB...
// ✅ Loaded X employer profiles
```

### Xem Lambda logs
```powershell
aws logs tail /aws/lambda/EmployerProfileAPI --follow
```

### Test API trực tiếp (cần token)
```powershell
# Get token from browser localStorage
# Then test:
curl -H "Authorization: Bearer YOUR_TOKEN" https://dlidp35x33.execute-api.ap-southeast-1.amazonaws.com/prod/admin/employers
```

## 📊 API Endpoint

**GET /admin/employers**
- URL: https://dlidp35x33.execute-api.ap-southeast-1.amazonaws.com/prod/admin/employers
- Method: GET
- Auth: Bearer token (Cognito)
- Response: Array of employer profiles

## ⚠️ Troubleshooting

### "Access denied - admin privileges required"
→ User không có trong Cognito group "Admin"

### "Authentication required"
→ Token không hợp lệ hoặc đã hết hạn

### Không load được dữ liệu
→ Kiểm tra console logs và Lambda logs

## 🎉 Success!

Khi mọi thứ hoạt động, bạn sẽ thấy:
- Danh sách nhà tuyển dụng từ DynamoDB
- Stats cập nhật real-time
- Nút "Duyệt" hoạt động
- Nút "Làm mới" reload dữ liệu
