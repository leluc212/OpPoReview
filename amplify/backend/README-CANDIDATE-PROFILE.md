# Candidate Profile DynamoDB Table

## Tổng quan

Bảng DynamoDB này lưu trữ thông tin hồ sơ cá nhân của từng ứng viên. Mỗi ứng viên có một hồ sơ duy nhất được liên kết với userId từ AWS Cognito.

## Cấu trúc bảng

### Primary Key
- **userId** (String): Cognito user ID - Partition Key

### Attributes

#### Thông tin cơ bản (Basic Information)
- `fullName` (String): Họ và tên đầy đủ
- `email` (String): Địa chỉ email
- `phone` (String): Số điện thoại
- `location` (String): Địa điểm hiện tại
- `cccd` (String): Số CCCD/CMND (locked - chỉ được set 1 lần)
- `dateOfBirth` (String): Ngày sinh ISO format (locked - chỉ được set 1 lần)

#### Thông tin nghề nghiệp (Professional Information)
- `title` (String): Chức danh/vị trí mong muốn
- `bio` (String): Giới thiệu bản thân/kinh nghiệm

#### Dữ liệu bổ sung (Additional Data)
- `profileImage` (String): Ảnh đại diện (Base64 hoặc S3 URL)
- `skills` (List<String>): Danh sách kỹ năng

#### Metadata
- `createdAt` (String): Thời gian tạo hồ sơ
- `updatedAt` (String): Thời gian cập nhật gần nhất
- `profileCompletion` (Number): Phần trăm hoàn thành hồ sơ (0-100)
- `isActive` (Boolean): Trạng thái hoạt động của hồ sơ

### Global Secondary Indexes (GSI)

#### EmailIndex
- **Partition Key**: email (String)
- **Purpose**: Tìm kiếm hồ sơ theo email
- **Projection**: ALL

## Các trường KHÔNG được lưu trong bảng này

Theo yêu cầu, các thông tin sau được lưu ở bảng riêng:

1. **Xác minh EKYC**: Lưu trong bảng `CandidateKYC`
   - Ảnh CCCD mặt trước/sau
   - Ảnh khuôn mặt
   - Trạng thái xác minh
   - Thông tin xác thực

2. **Thống kê**: Lưu trong bảng `CandidateStats`
   - Số công việc hoàn thành
   - Đánh giá trung bình
   - Tỷ lệ thành công
   - Lịch sử ứng tuyển

3. **CV/Hồ sơ**: Lưu trong bảng `CandidateDocuments`
   - File CV (PDF/DOC)
   - Các chứng chỉ
   - Bằng cấp

## Quy tắc bảo mật

### Locked Fields (Trường khóa)
Các trường sau chỉ được set một lần và không thể thay đổi:
- `cccd`: Số CCCD
- `dateOfBirth`: Ngày sinh

Lý do: Đảm bảo tính toàn vẹn dữ liệu và tuân thủ quy định pháp luật về thông tin cá nhân.

### Access Control
- Ứng viên chỉ có thể đọc/ghi hồ sơ của chính mình
- Admin có thể đọc tất cả hồ sơ
- Không ai có thể xóa vĩnh viễn (chỉ soft delete bằng cách set `isActive = false`)

## API Endpoints

### 1. Lấy hồ sơ của user hiện tại
```
GET /profile/{userId}
Authorization: Bearer {token}
```

Response:
```json
{
  "success": true,
  "data": {
    "userId": "abc123",
    "fullName": "Lực Thứ Hai",
    "email": "lucthuhai@gmail.com",
    "phone": "+84 379784509",
    "location": "Thủ Đức, TP.HCM",
    "cccd": "079202012345",
    "dateOfBirth": "2000-01-15",
    "title": "Nhân viên Phục Vụ / Pha Chế",
    "bio": "Có kinh nghiệm...",
    "profileImage": "data:image/jpeg;base64,...",
    "skills": ["Pha chế cơ bản", "Giao tiếp khách hàng"],
    "profileCompletion": 85,
    "isActive": true,
    "createdAt": "2026-03-12T10:00:00Z",
    "updatedAt": "2026-03-12T15:30:00Z"
  }
}
```

### 2. Tạo hồ sơ mới
```
POST /profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "Lực Thứ Hai",
  "email": "lucthuhai@gmail.com",
  "phone": "+84 379784509",
  "location": "Thủ Đức, TP.HCM",
  "title": "Nhân viên Phục Vụ",
  "bio": "Có kinh nghiệm..."
}
```

### 3. Cập nhật hồ sơ
```
PUT /profile/{userId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "location": "Quận 1, TP.HCM",
  "bio": "Updated bio...",
  "skills": ["Pha chế", "Phục vụ"]
}
```

Note: Không thể cập nhật `cccd` và `dateOfBirth` sau khi đã set.

### 4. Xóa hồ sơ (soft delete)
```
DELETE /profile/{userId}
Authorization: Bearer {token}
```

### 5. Tìm hồ sơ theo email
```
GET /profile/email/{email}
Authorization: Bearer {token}
```

## Sử dụng trong React

### Import service
```javascript
import candidateProfileService from '../services/candidateProfileService';
```

### Lấy hồ sơ hiện tại
```javascript
const profile = await candidateProfileService.getMyProfile();
```

### Tạo hồ sơ mới
```javascript
const newProfile = await candidateProfileService.createProfile({
  fullName: 'Lực Thứ Hai',
  email: 'lucthuhai@gmail.com',
  phone: '+84 379784509',
  location: 'Thủ Đức, TP.HCM'
});
```

### Cập nhật hồ sơ
```javascript
const updated = await candidateProfileService.updateProfile({
  location: 'Quận 1, TP.HCM',
  bio: 'Updated bio...'
});
```

### Đồng bộ từ localStorage lên DynamoDB
```javascript
// Migrate dữ liệu từ localStorage lên database
await candidateProfileService.syncLocalProfile();
```

### Load từ DynamoDB về localStorage
```javascript
// Load dữ liệu từ database về localStorage
await candidateProfileService.loadProfileToLocal();
```

## Deployment

### 1. Tạo bảng DynamoDB

Sử dụng AWS CLI:
```bash
aws dynamodb create-table \
  --table-name CandidateProfiles \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=email,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
  --global-secondary-indexes \
    '[{
      "IndexName": "EmailIndex",
      "KeySchema": [{"AttributeName":"email","KeyType":"HASH"}],
      "Projection": {"ProjectionType":"ALL"},
      "ProvisionedThroughput": {"ReadCapacityUnits":5,"WriteCapacityUnits":5}
    }]' \
  --billing-mode PAY_PER_REQUEST \
  --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES \
  --region ap-southeast-1
```

Hoặc sử dụng AWS Console:
1. Vào DynamoDB Console
2. Tạo table mới với tên `CandidateProfiles`
3. Partition key: `userId` (String)
4. Thêm GSI: `EmailIndex` với partition key `email`
5. Chọn billing mode: On-demand
6. Enable DynamoDB Streams

### 2. Deploy Lambda functions

```bash
# Deploy API Lambda
cd amplify/backend
zip -r candidate-profile-api.zip api-candidate-profile.cjs candidate-profile.cjs
aws lambda create-function \
  --function-name CandidateProfileAPI \
  --runtime nodejs18.x \
  --handler api-candidate-profile.handler \
  --zip-file fileb://candidate-profile-api.zip \
  --role arn:aws:iam::ACCOUNT_ID:role/LambdaExecutionRole \
  --environment Variables={CANDIDATE_PROFILE_TABLE=CandidateProfiles}
```

### 3. Cấu hình API Gateway

Tạo REST API với các routes:
- `GET /profile/{userId}`
- `POST /profile`
- `PUT /profile/{userId}`
- `DELETE /profile/{userId}`
- `GET /profile/email/{email}`

Kết nối với Lambda function `CandidateProfileAPI`

### 4. Cấu hình IAM Permissions

Lambda function cần quyền:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:ap-southeast-1:ACCOUNT_ID:table/CandidateProfiles",
        "arn:aws:dynamodb:ap-southeast-1:ACCOUNT_ID:table/CandidateProfiles/index/*"
      ]
    }
  ]
}
```

## Testing

### Test tạo hồ sơ
```bash
curl -X POST https://api.example.com/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "+84123456789",
    "location": "TP.HCM"
  }'
```

### Test lấy hồ sơ
```bash
curl -X GET https://api.example.com/profile/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Monitoring

### CloudWatch Metrics
- Read/Write capacity units
- Throttled requests
- System errors
- User errors

### CloudWatch Logs
- Lambda execution logs
- API Gateway access logs
- DynamoDB Streams logs

## Cost Estimation

Với 1000 ứng viên active:
- DynamoDB storage: ~1GB = $0.25/month
- Read requests: ~10,000/month = $1.25/month
- Write requests: ~2,000/month = $1.25/month
- Lambda invocations: ~12,000/month = $0.20/month

**Total: ~$3/month**

## Troubleshooting

### Lỗi "Profile already exists"
- Nguyên nhân: Đang cố tạo profile cho user đã có profile
- Giải pháp: Sử dụng UPDATE thay vì CREATE

### Lỗi "CCCD cannot be changed"
- Nguyên nhân: Đang cố thay đổi CCCD đã được set
- Giải pháp: CCCD chỉ được set 1 lần, không thể thay đổi

### Lỗi "Unauthorized"
- Nguyên nhân: Token không hợp lệ hoặc hết hạn
- Giải pháp: Đăng nhập lại để lấy token mới

## Future Enhancements

1. **Profile versioning**: Lưu lịch sử thay đổi hồ sơ
2. **Profile validation**: Xác thực số điện thoại, email
3. **Profile search**: Tìm kiếm ứng viên theo kỹ năng, địa điểm
4. **Profile analytics**: Thống kê profile completion rate
5. **Profile backup**: Tự động backup dữ liệu định kỳ
