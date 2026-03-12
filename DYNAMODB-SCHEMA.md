# DynamoDB Schema

## Tổng quan

Hệ thống sử dụng 2 bảng DynamoDB chính:
1. **PostStandardJob** - Tin tuyển dụng thông thường
2. **PostQuickJob** - Tin tuyển dụng gấp (urgent jobs)

---

## Bảng 1: PostStandardJob

Bảng này lưu trữ tất cả các tin tuyển dụng thông thường được đăng bởi nhà tuyển dụng.

### Primary Key
- **Partition Key**: `idJob` (String) - ID duy nhất cho mỗi tin tuyển dụng
  - Format: `JOB-YYYYMMDD-XXXXX`
  - Ví dụ: `JOB-20260312-A7B3C`

### Attributes

#### Thông tin cơ bản
| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `idJob` | String | Yes | ID duy nhất của tin tuyển dụng (Primary Key) |
| `employerId` | String | Yes | ID của nhà tuyển dụng (Cognito userId) |
| `employerEmail` | String | Yes | Email của nhà tuyển dụng |
| `title` | String | Yes | Tiêu đề công việc (VD: "Nhân viên pha chế") |
| `location` | String | Yes | Địa điểm làm việc (VD: "Quận Cam") |
| `jobType` | String | Yes | Loại hình công việc: "part-time" hoặc "full-time" |
| `workDays` | String | Yes | Ngày làm việc (ISO date format) |
| `workHours` | String | Yes | Giờ làm việc (VD: "8:00 - 17:00") |
| `salary` | Number | No | Mức lương theo giờ (VNĐ/h) |
| `tags` | String | No | Các tag phân cách bằng dấu phẩy (VD: "Pha chế, F&B, Coffee") |

#### Mô tả chi tiết
| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `description` | String | Yes | Mô tả công việc chi tiết |
| `responsibilities` | String | No | Trách nhiệm công việc |
| `requirements` | String | No | Yêu cầu ứng viên |
| `benefits` | String | No | Quyền lợi và phúc lợi |

#### Trạng thái và thống kê
| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | String | Yes | Trạng thái: "active", "paused", "closed" |
| `category` | String | Yes | Loại công việc: "standard" (luôn là "standard" cho PostStandardJob) |
| `applicants` | Number | Yes | Số lượng ứng viên đã ứng tuyển |
| `views` | Number | Yes | Số lượt xem tin tuyển dụng |
| `responseRate` | Number | Yes | Tỷ lệ phản hồi (%) |

#### Metadata
| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `createdAt` | String | Yes | Thời gian tạo (ISO 8601 format) |
| `updatedAt` | String | Yes | Thời gian cập nhật cuối (ISO 8601 format) |

### Indexes (GSI - Global Secondary Index)

#### GSI 1: EmployerIndex
- **Partition Key**: `employerId`
- **Sort Key**: `createdAt`
- **Purpose**: Query tất cả tin tuyển dụng của một nhà tuyển dụng, sắp xếp theo thời gian tạo

#### GSI 2: StatusIndex
- **Partition Key**: `status`
- **Sort Key**: `createdAt`
- **Purpose**: Query tất cả tin tuyển dụng theo trạng thái (VD: tất cả tin "active")

### Sample Data

```json
{
  "idJob": "JOB-20260312-A7B3C",
  "employerId": "us-east-1:12345678-1234-1234-1234-123456789abc",
  "employerEmail": "employer@example.com",
  "title": "Nhân viên pha chế",
  "location": "Quận 1, TP.HCM",
  "jobType": "part-time",
  "workDays": "2026-03-15",
  "workHours": "8:00 - 17:00",
  "salary": 25000,
  "tags": "Pha chế, F&B, Coffee",
  "description": "Tìm nhân viên pha chế có kinh nghiệm cho quán cà phê",
  "responsibilities": "Pha chế các loại đồ uống, phục vụ khách hàng",
  "requirements": "Có kinh nghiệm ít nhất 6 tháng",
  "benefits": "Lương cạnh tranh, môi trường thân thiện",
  "status": "active",
  "applicants": 5,
  "views": 120,
  "responseRate": 85,
  "createdAt": "2026-03-12T10:30:00.000Z",
  "updatedAt": "2026-03-12T10:30:00.000Z"
}
```

### API Endpoints

#### POST /jobs
Tạo tin tuyển dụng mới
- Tự động generate `idJob` ngẫu nhiên
- Tự động set `createdAt` và `updatedAt`

#### GET /jobs/employer/{employerId}
Lấy tất cả tin tuyển dụng của một nhà tuyển dụng

#### GET /jobs/{idJob}
Lấy chi tiết một tin tuyển dụng

#### PUT /jobs/{idJob}
Cập nhật tin tuyển dụng
- Tự động update `updatedAt`

#### DELETE /jobs/{idJob}
Xóa tin tuyển dụng (soft delete - set status = "deleted")

#### GET /jobs/active
Lấy tất cả tin tuyển dụng đang active (cho ứng viên xem)

#### POST /jobs/{idJob}/views
Tăng số lượt xem

### Notes

1. **idJob Generation**: ID được tạo tự động theo format `JOB-YYYYMMDD-XXXXX` để dễ quản lý và tìm kiếm
2. **Soft Delete**: Khi xóa tin tuyển dụng, chỉ thay đổi status thành "deleted" thay vì xóa hẳn
3. **Timestamps**: Tất cả timestamps sử dụng ISO 8601 format (UTC)
4. **Authentication**: Tất cả API endpoints yêu cầu JWT token từ Cognito
5. **Authorization**: Chỉ nhà tuyển dụng sở hữu tin tuyển dụng mới có thể update/delete


---

## Bảng 2: PostQuickJob

Bảng này lưu trữ các tin tuyển dụng gấp (urgent/quick jobs) với thời hạn ngắn.

### Primary Key
- **Partition Key**: `idJob` (String) - ID duy nhất cho mỗi tin tuyển gấp
  - Format: `QJOB-YYYYMMDD-XXXXX`
  - Ví dụ: `QJOB-20260313-A7B3C`

### Attributes

#### Thông tin cơ bản
| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `idJob` | String | Yes | ID duy nhất của tin tuyển dụng (Primary Key) |
| `employerId` | String | Yes | ID của nhà tuyển dụng (Cognito userId) |
| `employerEmail` | String | Yes | Email của nhà tuyển dụng |
| `companyName` | String | Yes | Tên công ty để hiển thị |
| `title` | String | Yes | Tiêu đề công việc (VD: "Ca Tối - Nhân viên Phục vụ") |
| `location` | String | Yes | Địa điểm làm việc (VD: "Quận 1, TP.HCM") |
| `jobType` | String | Yes | Loại hình công việc: "part-time" hoặc "full-time" |
| `hourlyRate` | Number | Yes | Mức lương theo giờ (VNĐ/h) |
| `startTime` | String | Yes | Giờ bắt đầu ca làm việc (Format: "HH:MM", VD: "18:00") |
| `endTime` | String | Yes | Giờ kết thúc ca làm việc (Format: "HH:MM", VD: "23:00") |
| `totalHours` | Number | Yes | Tổng số giờ làm việc (tính toán từ startTime và endTime) |
| `totalSalary` | Number | Yes | Tổng lương (hourlyRate × totalHours) |

#### Mô tả chi tiết
| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `description` | String | No | Mô tả công việc chi tiết |
| `requirements` | String | No | Yêu cầu ứng viên |

#### Trạng thái và thống kê
| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | String | Yes | Trạng thái: "pending", "active", "completed", "expired", "deleted" |
| `category` | String | Yes | Loại công việc: "quick-jobs" (luôn là "quick-jobs" cho PostQuickJob) |
| `applicants` | Number | Yes | Số lượng ứng viên đã ứng tuyển |
| `views` | Number | Yes | Số lượt xem tin tuyển dụng |
| `fee` | Number | Yes | Phí escrow (bằng totalSalary) |

#### Metadata
| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `createdAt` | String | Yes | Thời gian tạo (ISO 8601 format) |
| `updatedAt` | String | Yes | Thời gian cập nhật cuối (ISO 8601 format) |

### Indexes (GSI - Global Secondary Index)

#### GSI 1: EmployerIndex
- **Partition Key**: `employerId`
- **Sort Key**: `createdAt`
- **Purpose**: Query tất cả tin tuyển gấp của một nhà tuyển dụng, sắp xếp theo thời gian tạo

#### GSI 2: StatusIndex
- **Partition Key**: `status`
- **Sort Key**: `createdAt`
- **Purpose**: Query tất cả tin tuyển gấp theo trạng thái (VD: tất cả tin "active")

### Sample Data

```json
{
  "idJob": "QJOB-20260313-A7B3C",
  "employerId": "us-east-1:12345678-1234-1234-1234-123456789abc",
  "employerEmail": "employer@example.com",
  "companyName": "Nhà hàng ABC",
  "title": "Ca Tối - Nhân viên Phục vụ",
  "location": "Quận 1, TP.HCM",
  "jobType": "part-time",
  "hourlyRate": 35000,
  "startTime": "18:00",
  "endTime": "23:00",
  "totalHours": 5,
  "totalSalary": 175000,
  "description": "Cần nhân viên phục vụ ca tối, làm việc tại quán ăn khu vực trung tâm",
  "requirements": "Nhiệt tình, nhanh nhẹn, có kinh nghiệm ưu tiên",
  "status": "active",
  "category": "quick-jobs",
  "applicants": 3,
  "views": 25,
  "fee": 175000,
  "createdAt": "2026-03-13T10:30:00.000Z",
  "updatedAt": "2026-03-13T10:30:00.000Z"
}
```

### API Endpoints

#### POST /quick-jobs
Tạo tin tuyển gấp mới
- Tự động generate `idJob` ngẫu nhiên
- Tự động set `createdAt` và `updatedAt`
- Tự động set `category` = "quick-jobs"
- Lấy `companyId` và `companyName` từ Cognito và employer profile

#### GET /quick-jobs/employer/{employerId}
Lấy tất cả tin tuyển gấp của một nhà tuyển dụng

#### GET /quick-jobs/{idJob}
Lấy chi tiết một tin tuyển gấp

#### PUT /quick-jobs/{idJob}
Cập nhật tin tuyển gấp
- Tự động update `updatedAt`

#### DELETE /quick-jobs/{idJob}
Xóa tin tuyển gấp (soft delete - set status = "deleted")

#### GET /quick-jobs/active
Lấy tất cả tin tuyển gấp đang active (cho ứng viên xem)

#### POST /quick-jobs/{idJob}/views
Tăng số lượt xem

### Notes

1. **idJob Generation**: ID được tạo tự động theo format `QJOB-YYYYMMDD-XXXXX` để phân biệt với standard jobs
2. **Category**: Luôn là "quick-jobs" để phân biệt với PostStandardJob
3. **Company Info**: `companyId` và `companyName` được lấy từ Cognito và employer profile để liên kết
4. **Escrow**: `fee` bằng `totalSalary` và được giữ trong escrow wallet
5. **Time Calculation**: `totalHours` được tính tự động từ `startTime` và `endTime`
6. **Soft Delete**: Khi xóa tin tuyển dụng, chỉ thay đổi status thành "deleted" thay vì xóa hẳn
7. **Timestamps**: Tất cả timestamps sử dụng ISO 8601 format (UTC)
8. **Authentication**: Tất cả API endpoints yêu cầu JWT token từ Cognito (trừ GET public endpoints)
9. **Authorization**: Chỉ nhà tuyển dụng sở hữu tin tuyển dụng mới có thể update/delete

---

## So sánh PostStandardJob vs PostQuickJob

| Feature | PostStandardJob | PostQuickJob |
|---------|----------------|--------------|
| ID Format | JOB-YYYYMMDD-XXXXX | QJOB-YYYYMMDD-XXXXX |
| Category | "standard" | "quick-jobs" |
| Duration | Dài hạn (tuần/tháng) | Ngắn hạn (2-7 ngày) |
| Job Type | part-time / full-time | part-time / full-time |
| Salary Type | Có thể theo tháng/giờ | Chỉ theo giờ |
| Time Specification | workDays + workHours | startTime + endTime |
| Description Fields | description, responsibilities, requirements, benefits | description, requirements |
| Company Link | employerId + employerEmail | employerId + employerEmail + companyName |
| Escrow | Không | Có (fee = totalSalary) |
| Priority | Bình thường | Ưu tiên cao |
| Use Case | Tuyển dụng thường xuyên | Tuyển gấp, ca làm ngắn |

---

## Liên kết với Cognito

Cả hai bảng đều liên kết với AWS Cognito User Pools:

1. **employerId**: Lấy từ Cognito `sub` (user ID)
2. **employerEmail**: Lấy từ Cognito `email` attribute
3. **companyName**: Lấy từ employer profile table hoặc Cognito custom attribute

### Cách lấy thông tin từ Cognito

```javascript
import { fetchAuthSession } from 'aws-amplify/auth';

const session = await fetchAuthSession();
const idToken = session.tokens.idToken;
const payload = idToken.payload;

const employerId = payload.sub;
const employerEmail = payload.email;
const companyName = payload['custom:companyName']; // Custom attribute
```

### Lambda Function Integration

Lambda function tự động extract user info từ Cognito Authorizer:

```python
# Extract user ID from Cognito authorizer
authorizer = event.get('requestContext', {}).get('authorizer', {})
claims = authorizer.get('claims', {})
user_id = claims.get('sub')
user_email = claims.get('email')
```
