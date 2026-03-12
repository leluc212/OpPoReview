# DynamoDB Schema - PostStandardJob

## Bảng: PostStandardJob

Bảng này lưu trữ tất cả các tin tuyển dụng được đăng bởi nhà tuyển dụng.

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
