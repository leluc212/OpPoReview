# Sửa lỗi CORS cho Admin Employer API

## Tóm tắt

Đã cập nhật Lambda function với admin routes và cấu hình CORS cho API Gateway.

## Những gì đã làm

### 1. Cập nhật Lambda Function ✅
- Deploy code `api-employer-profile-admin.cjs` lên Lambda `EmployerProfileAPI`
- Thêm dependency `jsonwebtoken` để decode JWT token
- Lambda handler đã xử lý OPTIONS requests với CORS headers

### 2. Cấu hình API Gateway ✅
- Thêm OPTIONS method cho resource `/admin/employers`
- Cấu hình AWS_PROXY integration để Lambda xử lý OPTIONS
- Thêm Lambda permission cho API Gateway invoke OPTIONS

### 3. Admin Routes có sẵn

```
GET  /admin/employers              - List all employers (Admin only)
POST /admin/employers/{id}/approve - Approve employer (Admin only)
POST /admin/employers/{id}/reject  - Reject employer (Admin only)
POST /admin/employers/{id}/verify  - Update verification (Admin only)
```

## Kiểm tra lỗi

### Bước 1: Kiểm tra user có quyền Admin không

Đăng nhập vào trang web và mở Console (F12), chạy:

```javascript
import { fetchAuthSession } from 'aws-amplify/auth';

const session = await fetchAuthSession();
const token = session.tokens.idToken;
const decoded = JSON.parse(atob(token.toString().split('.')[1]));

console.log('User groups:', decoded['cognito:groups']);
// Phải có 'Admin' hoặc 'admin' trong groups
```

### Bước 2: Kiểm tra API endpoint

Mở file `.env` và xác nhận:

```env
VITE_EMPLOYER_API_URL=https://dlidp35x33.execute-api.ap-southeast-1.amazonaws.com/prod
```

### Bước 3: Test API trực tiếp

Mở Console (F12) trong trang web đã đăng nhập, chạy:

```javascript
import { fetchAuthSession } from 'aws-amplify/auth';

const session = await fetchAuthSession();
const token = session.tokens.idToken.toString();

const response = await fetch('https://dlidp35x33.execute-api.ap-southeast-1.amazonaws.com/prod/admin/employers', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log('Response:', data);
```

### Bước 4: Kiểm tra Lambda logs

```powershell
aws logs tail /aws/lambda/EmployerProfileAPI --since 5m --follow --region ap-southeast-1
```

## Nếu vẫn còn lỗi CORS

### Lỗi: "has been blocked by CORS policy"

Nguyên nhân có thể:
1. Browser cache - Thử hard refresh (Ctrl+Shift+R)
2. OPTIONS request không trả về đúng headers
3. Lambda không trả về CORS headers trong response

### Giải pháp:

1. **Hard refresh browser** (Ctrl+Shift+R hoặc Ctrl+F5)

2. **Xóa cache và cookies** của localhost:3000

3. **Kiểm tra Lambda response** có CORS headers:

```javascript
// Lambda phải trả về:
{
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  },
  body: JSON.stringify(data)
}
```

4. **Test với Postman hoặc curl** để loại trừ vấn đề browser:

```bash
curl -X GET \
  https://dlidp35x33.execute-api.ap-southeast-1.amazonaws.com/prod/admin/employers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

## Nếu lỗi 403 Forbidden

Nguyên nhân:
- User không có quyền Admin trong Cognito groups
- Token không hợp lệ hoặc đã hết hạn

Giải pháp:
1. Thêm user vào Admin group trong Cognito
2. Đăng xuất và đăng nhập lại để lấy token mới

## Thêm user vào Admin group

```powershell
# Lấy User Pool ID
$USER_POOL_ID = (aws cognito-idp list-user-pools --max-results 10 --region ap-southeast-1 --query "UserPools[0].Id" --output text)

# Thêm user vào Admin group
aws cognito-idp admin-add-user-to-group `
  --user-pool-id $USER_POOL_ID `
  --username "YOUR_USERNAME" `
  --group-name "Admin" `
  --region ap-southeast-1
```

## Test lại

1. Đăng xuất khỏi ứng dụng
2. Đăng nhập lại
3. Vào trang Admin > Employers Management
4. Kiểm tra Console (F12) xem có lỗi gì không

## Liên hệ

Nếu vẫn còn lỗi, cung cấp:
1. Screenshot của lỗi trong Console
2. Response từ API (nếu có)
3. User groups từ token
