# Hướng dẫn tạo bảng DynamoDB cho Candidate Profile

## Bước 1: Cài đặt AWS CLI

### Windows
1. Download AWS CLI từ: https://aws.amazon.com/cli/
2. Chạy file installer
3. Kiểm tra: `aws --version`

### Hoặc sử dụng npm
```bash
npm install -g aws-cli
```

## Bước 2: Cấu hình AWS Credentials

Chạy lệnh sau và nhập thông tin:
```bash
aws configure
```

Nhập:
- AWS Access Key ID: [Your Access Key]
- AWS Secret Access Key: [Your Secret Key]
- Default region name: ap-southeast-1
- Default output format: json

## Bước 3: Cài đặt dependencies

```bash
npm install
```

Lệnh này sẽ cài đặt:
- @aws-sdk/client-dynamodb
- @aws-sdk/lib-dynamodb

## Bước 4: Tạo bảng DynamoDB

### Cách 1: Sử dụng Node.js script (Khuyến nghị)

```bash
npm run create-profile-table
```

### Cách 2: Sử dụng PowerShell script (Windows)

```powershell
npm run create-profile-table:ps
```

### Cách 3: Sử dụng AWS CLI trực tiếp

```bash
aws dynamodb create-table \
  --table-name CandidateProfiles \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=email,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
  --global-secondary-indexes \
    '[{"IndexName":"EmailIndex","KeySchema":[{"AttributeName":"email","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"}}]' \
  --billing-mode PAY_PER_REQUEST \
  --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES \
  --region ap-southeast-1
```

### Cách 4: Sử dụng AWS Console (Manual)

1. Đăng nhập vào AWS Console: https://console.aws.amazon.com/
2. Vào DynamoDB service
3. Click "Create table"
4. Nhập thông tin:
   - **Table name**: CandidateProfiles
   - **Partition key**: userId (String)
5. Click "Add global secondary index":
   - **Index name**: EmailIndex
   - **Partition key**: email (String)
   - **Projection type**: All
6. Chọn **Billing mode**: On-demand
7. Trong **Additional settings**:
   - Enable **DynamoDB Streams**
   - Stream view type: **New and old images**
8. Click "Create table"

## Bước 5: Kiểm tra bảng đã tạo

### Sử dụng AWS CLI
```bash
aws dynamodb describe-table --table-name CandidateProfiles --region ap-southeast-1
```

### Sử dụng AWS Console
1. Vào DynamoDB Console
2. Click vào "Tables" ở sidebar
3. Tìm bảng "CandidateProfiles"
4. Click vào để xem chi tiết

## Bước 6: Test bảng

### Tạo một profile test
```bash
aws dynamodb put-item \
  --table-name CandidateProfiles \
  --item '{
    "userId": {"S": "test-user-123"},
    "fullName": {"S": "Test User"},
    "email": {"S": "test@example.com"},
    "phone": {"S": "+84123456789"},
    "location": {"S": "TP.HCM"},
    "createdAt": {"S": "2026-03-12T10:00:00Z"},
    "updatedAt": {"S": "2026-03-12T10:00:00Z"},
    "profileCompletion": {"N": "40"},
    "isActive": {"BOOL": true}
  }' \
  --region ap-southeast-1
```

### Lấy profile test
```bash
aws dynamodb get-item \
  --table-name CandidateProfiles \
  --key '{"userId": {"S": "test-user-123"}}' \
  --region ap-southeast-1
```

### Xóa profile test
```bash
aws dynamodb delete-item \
  --table-name CandidateProfiles \
  --key '{"userId": {"S": "test-user-123"}}' \
  --region ap-southeast-1
```

## Troubleshooting

### Lỗi: "Unable to locate credentials"
**Giải pháp**: Chạy `aws configure` và nhập credentials

### Lỗi: "User is not authorized to perform: dynamodb:CreateTable"
**Giải pháp**: IAM user cần có quyền DynamoDB. Thêm policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:CreateTable",
        "dynamodb:DescribeTable",
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": "*"
    }
  ]
}
```

### Lỗi: "Table already exists"
**Giải pháp**: Bảng đã được tạo rồi, không cần tạo lại

### Lỗi: "Cannot find module '@aws-sdk/client-dynamodb'"
**Giải pháp**: Chạy `npm install`

## Xem bảng trong AWS Console

Sau khi tạo xong, bạn có thể xem bảng tại:
```
https://ap-southeast-1.console.aws.amazon.com/dynamodbv2/home?region=ap-southeast-1#table?name=CandidateProfiles
```

## Chi phí ước tính

Với billing mode **PAY_PER_REQUEST**:
- Không có chi phí cố định
- Chỉ trả tiền khi có request
- Read: $0.25 per million requests
- Write: $1.25 per million requests
- Storage: $0.25 per GB/month

Ví dụ với 1000 users:
- 10,000 reads/month = $0.0025
- 2,000 writes/month = $0.0025
- 1GB storage = $0.25
- **Total: ~$0.26/month**

## Xóa bảng (nếu cần)

### Sử dụng AWS CLI
```bash
aws dynamodb delete-table --table-name CandidateProfiles --region ap-southeast-1
```

### Sử dụng AWS Console
1. Vào DynamoDB Console
2. Chọn bảng "CandidateProfiles"
3. Click "Delete"
4. Xác nhận xóa

## Next Steps

Sau khi tạo bảng xong:
1. ✅ Bảng DynamoDB đã sẵn sàng
2. 📝 Cấu hình API Gateway để kết nối với Lambda
3. 🚀 Deploy Lambda functions
4. 🔗 Cập nhật API_BASE_URL trong React app
5. 🧪 Test integration với React app

## Tài liệu tham khảo

- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
