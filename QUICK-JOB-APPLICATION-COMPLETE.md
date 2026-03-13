# Quick Job Application System - Hoàn thành

## Tổng quan

Hệ thống ứng tuyển cho Công việc tuyển gấp (Quick Jobs) đã được tích hợp hoàn chỉnh, cho phép ứng viên gửi CV và nhà tuyển dụng xem CV trong phần Quản lý nhân sự.

## Luồng hoạt động

### 1. Ứng viên gửi CV (JobListing.jsx)

Khi ứng viên nhấn "Gửi CV ngay" ở phần Công việc tuyển gấp:

```javascript
const confirmApply = async () => {
  // 1. Get CV info from S3
  const { getCVInfo } = await import('../../services/cvUploadService');
  const cvInfo = await getCVInfo(userId);
  
  // 2. Submit application
  const applicationService = (await import('../../services/applicationService')).default;
  await applicationService.submitApplication(
    jobId,
    cvInfo.cvUrl,
    cvInfo.cvFileName
  );
};
```

### 2. Backend xử lý (application-lambda.py)

Lambda function tự động:
- Kiểm tra job trong cả 2 bảng: `PostStandardJob` và `PostQuickJob`
- Lưu application vào bảng `StandardApplications` với `jobType: 'quick'`
- Tăng số lượng applicants cho job

### 3. Nhà tuyển dụng xem CV (HRManagement.jsx)

**Tab "Chờ xác nhận"** hiển thị:
- Tất cả applications có `status: 'pending'` từ Quick Jobs
- Thông tin ứng viên (email prefix làm tên tạm)
- Nút "Xem CV" để xem CV từ S3
- Nút "Đồng ý CV" để chấp nhận ứng viên

## Điểm đến khác nhau

### Standard Jobs → Applications.jsx
- Hiển thị trong tab "Hồ sơ ứng tuyển"
- Quản lý applications cho công việc tiêu chuẩn
- Có thể filter theo status, job, etc.

### Quick Jobs → HRManagement.jsx
- Hiển thị trong tab "Chờ xác nhận" của "Quản lý nhân sự"
- Tích hợp với workflow quản lý nhân viên part-time
- Có thể chat, đánh giá, quản lý ca làm việc

## Code Changes

### 1. HRManagement.jsx - Load Applications

```javascript
// State for applications
const [realApplications, setRealApplications] = useState([]);
const [loadingApplications, setLoadingApplications] = useState(false);

// Load applications when switching to HR section
useEffect(() => {
  if (activeSection === 'hr' && quickJobPosts.length > 0) {
    loadApplicationsFromQuickJobs();
  }
}, [activeSection, quickJobPosts]);

// Load applications from Quick Jobs
const loadApplicationsFromQuickJobs = async () => {
  const applicationService = (await import('../../services/applicationService')).default;
  
  const allApplications = [];
  for (const job of quickJobPosts) {
    const jobApplications = await applicationService.getJobApplications(job.idJob);
    const applicationsWithJobInfo = jobApplications.map(app => ({
      ...app,
      jobTitle: job.title,
      jobLocation: job.location,
      jobSalary: job.salary,
      jobShift: job.shift,
      jobWorkDate: job.deadline,
      jobType: 'quick'
    }));
    allApplications.push(...applicationsWithJobInfo);
  }
  
  setRealApplications(allApplications);
};
```

### 2. Convert Applications to Staff Format

```javascript
// Convert applications to staff format for display
const staffFromApplications = useMemo(() => {
  return realApplications
    .filter(app => app.status === 'pending')
    .map(app => ({
      id: app.applicationId,
      name: app.candidateEmail?.split('@')[0] || 'Unknown',
      position: app.jobTitle,
      location: app.jobLocation || 'N/A',
      phone: '***-***-****', // Hidden until confirmed
      email: '***@***.***', // Hidden until confirmed
      startDate: app.jobWorkDate || 'N/A',
      status: 'pending_confirmation',
      shift: app.jobShift || 'N/A',
      cvUrl: app.cvUrl,
      cvFilename: app.cvFilename || 'CV.pdf',
      candidateId: app.candidateId,
      candidateEmail: app.candidateEmail,
      jobId: app.jobId
    }));
}, [realApplications]);

// Combine mock staff with real applications
const allStaff = useMemo(() => {
  return [...hrStaff, ...staffFromApplications];
}, [hrStaff, staffFromApplications]);
```

### 3. Add CV Preview Button

```javascript
{staff.status === 'pending_confirmation' ? (
  <>
    {staff.cvUrl && (
      <StaffButton
        onClick={() => {
          setSelectedCV({ url: staff.cvUrl, filename: staff.cvFilename });
          setShowCVPreview(true);
        }}
      >
        <Eye />{language === 'vi' ? 'Xem CV' : 'View CV'}
      </StaffButton>
    )}
    <StaffButton
      $variant="success"
      onClick={() => handleConfirmCV(staff.id)}
    >
      <CheckCircle />{language === 'vi' ? 'Đồng ý CV' : 'Approve CV'}
    </StaffButton>
  </>
) : ...}
```

### 4. Add CVPreviewModal

```javascript
{showCVPreview && selectedCV && (
  <CVPreviewModal
    cvUrl={selectedCV.url}
    fileName={selectedCV.filename}
    onClose={() => {
      setShowCVPreview(false);
      setSelectedCV(null);
    }}
    onDownload={async () => {
      // Download CV logic
    }}
  />
)}
```

## Database Schema

### StandardApplications Table

```
Primary Key: applicationId (String)

Attributes:
- applicationId: String (APP-YYYYMMDD-XXXXX)
- jobId: String (JOB-YYYYMMDD-XXXXX hoặc QJOB-YYYYMMDD-XXXXX)
- jobTitle: String
- jobType: String (standard hoặc quick) ← Phân biệt loại công việc
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

## Testing

### 1. Test ứng viên gửi CV

1. Đăng nhập với tài khoản ứng viên
2. Vào trang "Công việc tuyển gấp"
3. Nhấn "Ứng tuyển ngay" trên một Quick Job
4. Nhấn "Gửi CV ngay"
5. Kiểm tra console log: `✅ Application submitted`

### 2. Test nhà tuyển dụng xem CV

1. Đăng nhập với tài khoản nhà tuyển dụng (owner của Quick Job)
2. Vào "Công việc tuyển gấp" → "Quản lý nhân sự"
3. Chọn tab "Chờ xác nhận"
4. Thấy ứng viên vừa apply
5. Nhấn "Xem CV" để xem CV từ S3
6. Nhấn "Đồng ý CV" để chấp nhận

### 3. Kiểm tra DynamoDB

```powershell
# Xem applications
aws dynamodb scan --table-name StandardApplications --region ap-southeast-1

# Filter Quick Job applications
aws dynamodb scan --table-name StandardApplications \
  --filter-expression "jobType = :type" \
  --expression-attribute-values '{":type":{"S":"quick"}}' \
  --region ap-southeast-1
```

## Security & Privacy

### Thông tin ẩn cho đến khi xác nhận

Trong tab "Chờ xác nhận":
- Phone: `***-***-****`
- Email: `***@***.***`

Sau khi nhấn "Đồng ý CV":
- Hiển thị đầy đủ thông tin
- Có thể chat với ứng viên
- Có thể quản lý ca làm việc

## Next Steps

1. **Email Notifications**: Gửi email khi có application mới
2. **Real-time Updates**: WebSocket để update real-time
3. **Application Analytics**: Thống kê tỷ lệ ứng tuyển
4. **Auto-approve**: Tự động chấp nhận CV dựa trên tiêu chí
5. **Interview Scheduling**: Tích hợp lịch phỏng vấn

## Troubleshooting

### Lỗi: "No applications found"
- Kiểm tra quickJobPosts đã load chưa
- Verify employerId trong job matches current user
- Check CloudWatch logs: `/aws/lambda/ApplicationLambda`

### Lỗi: "Cannot read cvUrl"
- Candidate chưa upload CV
- CV đã bị xóa khỏi S3
- Check S3 bucket permissions

### Lỗi: CORS khi xem CV
- Verify S3 bucket CORS configuration
- Check CV URL format
- Test direct S3 URL access

## Summary

✅ Quick Jobs applications được lưu vào cùng bảng `StandardApplications`
✅ Phân biệt bằng field `jobType: 'quick'`
✅ Hiển thị trong HRManagement.jsx tab "Chờ xác nhận"
✅ Có thể xem CV từ S3
✅ Có thể chấp nhận/từ chối ứng viên
✅ Tích hợp với workflow quản lý nhân sự

Hệ thống đã hoàn chỉnh và sẵn sàng sử dụng! 🎉
