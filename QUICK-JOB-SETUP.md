# Quick Job Setup Guide - DynamoDB Integration

## Tổng quan

Hướng dẫn này giúp bạn tích hợp tính năng Quick Jobs (Tuyển gấp) với DynamoDB.

## Các bước triển khai

### 1. Tạo bảng DynamoDB

Chạy script PowerShell để tạo bảng PostQuickJob:

```powershell
.\create-quick-job-table.ps1
```

Bảng sẽ có cấu trúc:
- **Primary Key**: `idJob` (String) - Format: QJOB-YYYYMMDD-XXXXX
- **GSI 1**: EmployerIndex (employerId + createdAt)
- **GSI 2**: StatusIndex (status + createdAt)

### 2. Tạo Lambda Function

#### 2.1. Tạo Lambda function

```powershell
# Tạo file zip cho Lambda
Compress-Archive -Path amplify/backend/quick-job-lambda.py -DestinationPath amplify/backend/quick-job-lambda.zip -Force

# Tạo Lambda function
aws lambda create-function `
    --function-name QuickJobHandler `
    --runtime python3.11 `
    --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-dynamodb-role `
    --handler quick-job-lambda.lambda_handler `
    --zip-file fileb://amplify/backend/quick-job-lambda.zip `
    --environment Variables="{TABLE_NAME=PostQuickJob}" `
    --region ap-southeast-1
```

#### 2.2. Cấp quyền DynamoDB cho Lambda

Tạo IAM policy cho Lambda:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:ap-southeast-1:YOUR_ACCOUNT_ID:table/PostQuickJob",
        "arn:aws:dynamodb:ap-southeast-1:YOUR_ACCOUNT_ID:table/PostQuickJob/index/*"
      ]
    }
  ]
}
```

### 3. Tạo API Gateway

#### 3.1. Tạo REST API

```powershell
# Tạo REST API
$apiId = aws apigateway create-rest-api `
    --name "QuickJobAPI" `
    --description "API for Quick Job postings" `
    --region ap-southeast-1 `
    --query 'id' `
    --output text

Write-Host "API ID: $apiId"

# Lấy root resource ID
$rootId = aws apigateway get-resources `
    --rest-api-id $apiId `
    --region ap-southeast-1 `
    --query 'items[0].id' `
    --output text
```

#### 3.2. Tạo resources và methods

```powershell
# Tạo /quick-jobs resource
$quickJobsId = aws apigateway create-resource `
    --rest-api-id $apiId `
    --parent-id $rootId `
    --path-part "quick-jobs" `
    --region ap-southeast-1 `
    --query 'id' `
    --output text

# POST /quick-jobs (Create)
aws apigateway put-method `
    --rest-api-id $apiId `
    --resource-id $quickJobsId `
    --http-method POST `
    --authorization-type COGNITO_USER_POOLS `
    --authorizer-id YOUR_AUTHORIZER_ID `
    --region ap-southeast-1

# GET /quick-jobs/active (Get all active)
$activeId = aws apigateway create-resource `
    --rest-api-id $apiId `
    --parent-id $quickJobsId `
    --path-part "active" `
    --region ap-southeast-1 `
    --query 'id' `
    --output text

aws apigateway put-method `
    --rest-api-id $apiId `
    --resource-id $activeId `
    --http-method GET `
    --authorization-type NONE `
    --region ap-southeast-1

# GET /quick-jobs/employer/{employerId}
$employerPathId = aws apigateway create-resource `
    --rest-api-id $apiId `
    --parent-id $quickJobsId `
    --path-part "employer" `
    --region ap-southeast-1 `
    --query 'id' `
    --output text

$employerIdId = aws apigateway create-resource `
    --rest-api-id $apiId `
    --parent-id $employerPathId `
    --path-part "{employerId}" `
    --region ap-southeast-1 `
    --query 'id' `
    --output text

aws apigateway put-method `
    --rest-api-id $apiId `
    --resource-id $employerIdId `
    --http-method GET `
    --authorization-type COGNITO_USER_POOLS `
    --authorizer-id YOUR_AUTHORIZER_ID `
    --region ap-southeast-1

# GET/PUT/DELETE /quick-jobs/{idJob}
$jobIdId = aws apigateway create-resource `
    --rest-api-id $apiId `
    --parent-id $quickJobsId `
    --path-part "{idJob}" `
    --region ap-southeast-1 `
    --query 'id' `
    --output text

aws apigateway put-method `
    --rest-api-id $apiId `
    --resource-id $jobIdId `
    --http-method GET `
    --authorization-type NONE `
    --region ap-southeast-1

aws apigateway put-method `
    --rest-api-id $apiId `
    --resource-id $jobIdId `
    --http-method PUT `
    --authorization-type COGNITO_USER_POOLS `
    --authorizer-id YOUR_AUTHORIZER_ID `
    --region ap-southeast-1

aws apigateway put-method `
    --rest-api-id $apiId `
    --resource-id $jobIdId `
    --http-method DELETE `
    --authorization-type COGNITO_USER_POOLS `
    --authorizer-id YOUR_AUTHORIZER_ID `
    --region ap-southeast-1
```

#### 3.3. Tích hợp Lambda

```powershell
# Lấy Lambda ARN
$lambdaArn = aws lambda get-function `
    --function-name QuickJobHandler `
    --region ap-southeast-1 `
    --query 'Configuration.FunctionArn' `
    --output text

# Tích hợp cho mỗi method (ví dụ POST /quick-jobs)
aws apigateway put-integration `
    --rest-api-id $apiId `
    --resource-id $quickJobsId `
    --http-method POST `
    --type AWS_PROXY `
    --integration-http-method POST `
    --uri "arn:aws:apigateway:ap-southeast-1:lambda:path/2015-03-31/functions/$lambdaArn/invocations" `
    --region ap-southeast-1

# Cấp quyền cho API Gateway gọi Lambda
aws lambda add-permission `
    --function-name QuickJobHandler `
    --statement-id apigateway-quick-jobs `
    --action lambda:InvokeFunction `
    --principal apigateway.amazonaws.com `
    --source-arn "arn:aws:execute-api:ap-southeast-1:YOUR_ACCOUNT_ID:$apiId/*/*" `
    --region ap-southeast-1
```

#### 3.4. Enable CORS

```powershell
# Enable CORS cho mỗi resource
aws apigateway put-method `
    --rest-api-id $apiId `
    --resource-id $quickJobsId `
    --http-method OPTIONS `
    --authorization-type NONE `
    --region ap-southeast-1

aws apigateway put-integration `
    --rest-api-id $apiId `
    --resource-id $quickJobsId `
    --http-method OPTIONS `
    --type MOCK `
    --request-templates '{"application/json": "{\"statusCode\": 200}"}' `
    --region ap-southeast-1

aws apigateway put-method-response `
    --rest-api-id $apiId `
    --resource-id $quickJobsId `
    --http-method OPTIONS `
    --status-code 200 `
    --response-parameters '{
        "method.response.header.Access-Control-Allow-Headers": true,
        "method.response.header.Access-Control-Allow-Methods": true,
        "method.response.header.Access-Control-Allow-Origin": true
    }' `
    --region ap-southeast-1

aws apigateway put-integration-response `
    --rest-api-id $apiId `
    --resource-id $quickJobsId `
    --http-method OPTIONS `
    --status-code 200 `
    --response-parameters '{
        "method.response.header.Access-Control-Allow-Headers": "\"Content-Type,Authorization\"",
        "method.response.header.Access-Control-Allow-Methods": "\"GET,POST,PUT,DELETE,OPTIONS\"",
        "method.response.header.Access-Control-Allow-Origin": "\"*\""
    }' `
    --region ap-southeast-1
```

#### 3.5. Deploy API

```powershell
# Tạo deployment
aws apigateway create-deployment `
    --rest-api-id $apiId `
    --stage-name prod `
    --region ap-southeast-1

# Lấy API URL
$apiUrl = "https://$apiId.execute-api.ap-southeast-1.amazonaws.com/prod"
Write-Host "API URL: $apiUrl"
```

### 4. Cập nhật Frontend

Cập nhật API URL trong `src/services/quickJobService.js`:

```javascript
const API_BASE_URL = 'https://YOUR_API_ID.execute-api.ap-southeast-1.amazonaws.com/prod';
```

### 5. Test API

Tạo file test HTML hoặc sử dụng Postman:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Quick Job API</title>
</head>
<body>
    <h1>Test Quick Job API</h1>
    <button onclick="testCreateQuickJob()">Create Quick Job</button>
    <button onclick="testGetActiveJobs()">Get Active Jobs</button>
    <pre id="result"></pre>

    <script>
        const API_URL = 'https://YOUR_API_ID.execute-api.ap-southeast-1.amazonaws.com/prod';

        async function testCreateQuickJob() {
            const jobData = {
                idJob: 'QJOB-20260313-TEST1',
                employerId: 'test-user-123',
                employerEmail: 'test@example.com',
                companyName: 'Test Company',
                title: 'Test Quick Job',
                location: 'Quận 1, TP.HCM',
                jobType: 'part-time',
                hourlyRate: 35000,
                startTime: '18:00',
                endTime: '23:00',
                totalHours: 5,
                totalSalary: 175000,
                description: 'Test job description',
                requirements: 'Test requirements',
                status: 'pending',
                category: 'quick-jobs'
            };

            try {
                const response = await fetch(`${API_URL}/quick-jobs`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jobData)
                });

                const result = await response.json();
                document.getElementById('result').textContent = JSON.stringify(result, null, 2);
            } catch (error) {
                document.getElementById('result').textContent = 'Error: ' + error.message;
            }
        }

        async function testGetActiveJobs() {
            try {
                const response = await fetch(`${API_URL}/quick-jobs/active`);
                const result = await response.json();
                document.getElementById('result').textContent = JSON.stringify(result, null, 2);
            } catch (error) {
                document.getElementById('result').textContent = 'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>
```

## Schema DynamoDB

### Bảng: PostQuickJob

#### Primary Key
- **Partition Key**: `idJob` (String) - Format: QJOB-YYYYMMDD-XXXXX

#### Attributes

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `idJob` | String | Yes | ID duy nhất (Primary Key) |
| `employerId` | String | Yes | ID nhà tuyển dụng (Cognito userId) |
| `employerEmail` | String | Yes | Email nhà tuyển dụng |
| `companyName` | String | Yes | Tên công ty |
| `title` | String | Yes | Tiêu đề công việc |
| `location` | String | Yes | Địa điểm làm việc |
| `jobType` | String | Yes | Loại hình: "part-time" hoặc "full-time" |
| `hourlyRate` | Number | Yes | Lương theo giờ (VNĐ) |
| `startTime` | String | Yes | Giờ bắt đầu (HH:MM) |
| `endTime` | String | Yes | Giờ kết thúc (HH:MM) |
| `totalHours` | Number | Yes | Tổng số giờ làm việc |
| `totalSalary` | Number | Yes | Tổng lương |
| `description` | String | No | Mô tả công việc |
| `requirements` | String | No | Yêu cầu ứng viên |
| `status` | String | Yes | Trạng thái: "pending", "active", "completed", "expired", "deleted" |
| `category` | String | Yes | Luôn là "quick-jobs" |
| `applicants` | Number | Yes | Số lượng ứng viên |
| `views` | Number | Yes | Số lượt xem |
| `fee` | Number | Yes | Phí escrow |
| `createdAt` | String | Yes | Thời gian tạo (ISO 8601) |
| `updatedAt` | String | Yes | Thời gian cập nhật (ISO 8601) |

#### Global Secondary Indexes

1. **EmployerIndex**
   - Partition Key: `employerId`
   - Sort Key: `createdAt`
   - Purpose: Query jobs by employer

2. **StatusIndex**
   - Partition Key: `status`
   - Sort Key: `createdAt`
   - Purpose: Query jobs by status

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/quick-jobs` | Required | Tạo quick job mới |
| GET | `/quick-jobs/active` | None | Lấy tất cả quick jobs active |
| GET | `/quick-jobs/employer/{employerId}` | Required | Lấy jobs của employer |
| GET | `/quick-jobs/{idJob}` | None | Lấy chi tiết 1 job |
| PUT | `/quick-jobs/{idJob}` | Required | Cập nhật job |
| DELETE | `/quick-jobs/{idJob}` | Required | Xóa job (soft delete) |
| POST | `/quick-jobs/{idJob}/views` | None | Tăng view count |

## Troubleshooting

### Lỗi CORS
Nếu gặp lỗi CORS, kiểm tra:
1. OPTIONS method đã được tạo cho tất cả resources
2. Integration response có đúng headers CORS
3. Lambda function trả về đúng CORS headers

### Lỗi Authorization
1. Kiểm tra Cognito User Pool ID
2. Kiểm tra Authorizer đã được tạo đúng
3. Kiểm tra token được gửi trong header Authorization

### Lỗi Lambda
1. Kiểm tra CloudWatch Logs
2. Kiểm tra IAM role có đủ quyền DynamoDB
3. Kiểm tra environment variable TABLE_NAME

## Notes

1. **Category**: Tất cả quick jobs đều có `category: "quick-jobs"` để phân biệt với standard jobs
2. **Company Info**: `companyName` được lấy từ employer profile thông qua Cognito
3. **Escrow**: Phí được giữ trong escrow và chỉ được giải phóng khi cả hai bên xác nhận
4. **Soft Delete**: Khi xóa, chỉ thay đổi status thành "deleted" thay vì xóa hẳn
5. **Fallback**: Service có fallback về localStorage nếu API không khả dụng
