# Hệ thống Ứng tuyển - Application System Setup

## Tổng quan

Hệ thống cho phép ứng viên gửi CV từ S3 đến nhà tuyển dụng khi ứng tuyển công việc.

## Luồng hoạt động

1. **Ứng viên**: Tải CV lên S3 trong phần "CV/Hồ sơ"
2. **Ứng viên**: Xem công việc và nhấn "Gửi CV ngay"
3. **Hệ thống**: Lấy CV URL từ S3 và tạo application record trong DynamoDB
4. **Nhà tuyển dụng**: Xem hồ sơ ứng tuyển trong phần "Hồ sơ ứng tuyển"
5. **Nhà tuyển dụng**: Xem/tải CV trực tiếp từ S3

## Cấu trúc Database

### Bảng: Applications

```
Primary Key: applicationId (String)

Attributes:
- applicationId: String (APP-YYYYMMDD-XXXXX)
- jobId: String (JOB-YYYYMMDD-XXXXX hoặc QJOB-YYYYMMDD-XXXXX)
- jobTitle: String
- jobType: String (standard hoặc quick)
- candidateId: String (Cognito userId)
- candidateEmail: String
- employerId: String (Cognito userId)
- employerEmail: String
- cvUrl: String (S3 URL)
- cvFilename: String
- status: String (pending, reviewed, accepted, rejected)
- appliedAt: String (ISO 8601)
- updatedAt: String (ISO 8601)

Global Secondary Indexes:
1. CandidateIndex: candidateId (HASH) + appliedAt (RANGE)
2. JobIndex: jobId (HASH) + appliedAt (RANGE)
```

## Setup Instructions

### Bước 1: Deploy API và Database

```powershell
# Chạy script để tạo DynamoDB table, Lambda function và API Gateway
.\create-application-api.ps1
```

Script sẽ tạo:
- DynamoDB table: `Applications`
- Lambda function: `ApplicationLambda`
- API Gateway: `ApplicationAPI`
- IAM roles và policies
- Cognito authorizer

### Bước 2: Cập nhật API Endpoint

Sau khi chạy script, bạn sẽ nhận được API endpoint:
```
https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com
```

Cập nhật endpoint trong file:
```javascript
// src/services/applicationService.js
const API_ENDPOINT = 'https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com';
```

### Bước 3: Test API

Mở file `test-application-api.html` trong browser:

1. Nhập API endpoint
2. Nhập JWT token (lấy từ Cognito sau khi login)
3. Test các endpoints:
   - Submit application
   - Get my applications
   - Get job applications
   - Update application status

### Bước 4: Verify trong AWS Console

#### DynamoDB
```powershell
# Kiểm tra table
aws dynamodb describe-table --table-name Applications --region us-east-1

# Xem dữ liệu
aws dynamodb scan --table-name Applications --region us-east-1
```

#### Lambda
```powershell
# Kiểm tra function
aws lambda get-function --function-name ApplicationLambda --region us-east-1

# Xem logs
aws logs tail /aws/lambda/ApplicationLambda --follow --region us-east-1
```

#### API Gateway
```powershell
# List APIs
aws apigatewayv2 get-apis --region us-east-1

# Test endpoint
curl -X GET "https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/applications/candidate/USER_ID" \
  -H "Authorization: YOUR_JWT_TOKEN"
```

## API Endpoints

### 1. Submit Application (POST /applications)
**Auth**: Required (Candidate)

Request:
```json
{
  "jobId": "JOB-20260313-XXXXX",
  "cvUrl": "https://s3.amazonaws.com/bucket/cv.pdf",
  "cvFilename": "CV.pdf"
}
```

Response:
```json
{
  "message": "Application submitted successfully",
  "applicationId": "APP-20260313-XXXXX",
  "application": { ... }
}
```

### 2. Get Candidate Applications (GET /applications/candidate/{candidateId})
**Auth**: Required (Candidate)

Response:
```json
{
  "applications": [ ... ],
  "count": 5
}
```

### 3. Get Job Applications (GET /applications/job/{jobId})
**Auth**: Required (Employer - must own the job)

Response:
```json
{
  "applications": [ ... ],
  "count": 12
}
```

### 4. Update Application Status (PUT /applications/{applicationId}/status)
**Auth**: Required (Employer - must own the job)

Request:
```json
{
  "status": "accepted"
}
```

Response:
```json
{
  "message": "Status updated successfully",
  "applicationId": "APP-20260313-XXXXX",
  "status": "accepted"
}
```

## Frontend Integration

### JobListing.jsx (Candidate)

Khi ứng viên nhấn "Gửi CV ngay":

```javascript
const confirmApply = async () => {
  // 1. Get userId from Cognito
  const session = await fetchAuthSession();
  const userId = session.tokens?.idToken?.payload?.sub;
  
  // 2. Get CV info from S3
  const { getCVInfo } = await import('../services/cvUploadService');
  const cvInfo = await getCVInfo(userId);
  
  // 3. Submit application
  const applicationService = (await import('../services/applicationService')).default;
  await applicationService.submitApplication(
    applyModal.job.idJob,
    cvInfo.cvUrl,
    cvInfo.cvFileName
  );
};
```

### Applications.jsx (Employer)

Load applications khi vào tab "Hồ sơ ứng tuyển":

```javascript
useEffect(() => {
  const loadApplications = async () => {
    const allApplications = [];
    
    for (const job of jobPosts) {
      const jobApplications = await applicationService.getJobApplications(job.idJob);
      allApplications.push(...jobApplications);
    }
    
    setRealApplications(allApplications);
  };
  
  if (activeSection === 'applications' && jobPosts.length > 0) {
    loadApplications();
  }
}, [activeSection, jobPosts]);
```

Hiển thị CV:

```javascript
<CVPreviewModal
  cvUrl={candidate.cvUrl}
  fileName={candidate.cvFileName}
  onClose={() => setShowCVPreview(false)}
  onDownload={handleCVDownload}
/>
```

## Security

### IAM Permissions

Lambda function cần quyền:
- DynamoDB: PutItem, GetItem, UpdateItem, Query, Scan
- Truy cập vào: Applications, PostStandardJob, PostQuickJob tables

### Cognito Authorization

- Tất cả endpoints yêu cầu JWT token từ Cognito
- Candidate chỉ xem được applications của mình
- Employer chỉ xem được applications cho jobs của mình

### S3 CORS

CV bucket cần CORS configuration để employer có thể xem:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

## Troubleshooting

### Lỗi: "Job not found"
- Kiểm tra jobId có tồn tại trong PostStandardJob hoặc PostQuickJob
- Verify format: JOB-YYYYMMDD-XXXXX hoặc QJOB-YYYYMMDD-XXXXX

### Lỗi: "No CV found"
- Candidate chưa upload CV trong phần CV/Hồ sơ
- Kiểm tra CV đã được lưu trong S3 và profile

### Lỗi: "Forbidden - Not your job"
- Employer đang cố xem applications của job không phải của mình
- Verify employerId trong job record

### Lỗi: CORS
- Kiểm tra S3 bucket CORS configuration
- Verify API Gateway CORS settings

## Testing Checklist

- [ ] Candidate có thể upload CV
- [ ] Candidate có thể apply job với CV
- [ ] Application được lưu vào DynamoDB
- [ ] Job applicants count tăng lên
- [ ] Employer thấy application trong danh sách
- [ ] Employer có thể xem CV từ S3
- [ ] Employer có thể download CV
- [ ] Employer có thể update application status
- [ ] Candidate thấy status update

## Next Steps

1. **Email Notifications**: Gửi email khi có application mới
2. **Real-time Updates**: WebSocket để update real-time
3. **Application Analytics**: Thống kê tỷ lệ ứng tuyển
4. **CV Parsing**: Tự động parse CV để extract thông tin
5. **Interview Scheduling**: Tích hợp lịch phỏng vấn

## Support

Nếu gặp vấn đề:
1. Check CloudWatch Logs: `/aws/lambda/ApplicationLambda`
2. Check DynamoDB table data
3. Verify API Gateway configuration
4. Test với `test-application-api.html`
