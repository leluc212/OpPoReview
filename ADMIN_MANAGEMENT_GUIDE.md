# Admin Management Guide (Hướng Dẫn Quản Lý Admin)

## Tổng Quan
Trang **Admin Management** cho phép Super Admin và Admin cấp cao quản lý các admin dưới cấp, bao gồm phê duyệt, từ chối, và phân quyền.

## Đường Dẫn
- **URL**: `/admin/management`
- **Menu**: Sidebar Admin → Management → Quản Lý Admin

## Tính Năng Chính

### 1. Thống Kê Tổng Quan (4 Cards)
- **Tổng Admin**: Hiển thị tổng số admin trong hệ thống
- **Đã Duyệt**: Số admin đã được phê duyệt (màu xanh lá)
- **Chờ Duyệt**: Số admin đang chờ phê duyệt (màu vàng)
- **Từ Chối**: Số admin bị từ chối (màu đỏ)

### 2. Phân Quyền Chi Tiết (6 Quyền)

#### Quyền Hạn Có Sẵn:
1. **Quản lý người dùng** (Manage Users)
   - Xem, duyệt, từ chối ứng viên và nhà tuyển dụng
   
2. **Quản lý bài đăng** (Manage Posts)
   - Kiểm duyệt, chỉnh sửa, xóa tin tuyển dụng
   
3. **Quản lý gói dịch vụ** (Manage Packages)
   - Xem, tạo, sửa các gói dịch vụ
   
4. **Xem báo cáo** (View Reports)
   - Truy cập báo cáo và phân tích dữ liệu
   
5. **Quản lý admin** (Manage Admins)
   - Duyệt, từ chối, xóa admin khác
   
6. **Cài đặt hệ thống** (System Settings)
   - Thay đổi cấu hình hệ thống

### 3. Vai Trò Admin (3 Cấp)

#### Super Admin (Màu Tím)
- **Quyền**: Toàn bộ 6 quyền
- **Đặc quyền**: Không thể bị xóa hoặc chỉnh sửa
- **Trách nhiệm**: Quản lý toàn bộ hệ thống

#### Admin (Màu Xanh Dương)
- **Quyền**: 4-5 quyền (không bao gồm Manage Admins và System Settings)
- **Trách nhiệm**: Quản lý người dùng, bài đăng, gói dịch vụ

#### Moderator (Màu Xanh Lá)
- **Quyền**: 2-3 quyền (chủ yếu kiểm duyệt)
- **Trách nhiệm**: Kiểm duyệt nội dung, xem báo cáo

### 4. Quy Trình Duyệt Admin

#### Bước 1: Admin Mới Đăng Ký
- Trạng thái: **Chờ Duyệt** (Pending)
- Hiển thị trong bảng với badge màu vàng
- Ngày tham gia được ghi nhận

#### Bước 2: Xem Chi Tiết
- Click nút "Xem" (View) để xem thông tin đầy đủ
- Thông tin hiển thị:
  - Email, Số điện thoại
  - Địa điểm
  - Ngày tham gia
  - Danh sách 6 quyền với icon ✅/❌

#### Bước 3: Phê Duyệt hoặc Từ Chối

**Phê Duyệt:**
- Click nút "Duyệt" (Approve)
- Trạng thái chuyển sang **Đã Duyệt** (Approved)
- Ngày xét duyệt được ghi nhận: **3/7/2026**
- Admin có thể đăng nhập và sử dụng hệ thống

**Từ Chối:**
- Click nút "Từ Chối" (Reject)
- **Bắt buộc** nhập lý do từ chối
- Trạng thái chuyển sang **Từ Chối** (Rejected)
- Admin không thể đăng nhập

### 5. Tính Năng Tìm Kiếm & Lọc

#### Tìm Kiếm
- Tìm theo tên admin
- Tìm theo email
- Real-time search (tìm kiếm ngay khi gõ)

#### Lọc Theo Trạng Thái
- **Tất cả**: Hiển thị tất cả admin
- **Đã duyệt**: Chỉ admin đã được phê duyệt
- **Chờ duyệt**: Chỉ admin đang chờ
- **Từ chối**: Chỉ admin bị từ chối

### 6. Thao Tác Với Admin

#### Với Admin Chờ Duyệt:
- 👁️ **Xem**: Xem chi tiết thông tin
- ✅ **Duyệt**: Phê duyệt admin
- ❌ **Từ chối**: Từ chối với lý do

#### Với Admin Đã Duyệt:
- 👁️ **Xem**: Xem chi tiết thông tin
- ✏️ **Sửa**: Chỉnh sửa thông tin và quyền
- 🗑️ **Xóa**: Xóa admin (có xác nhận)

#### Với Super Admin:
- 👁️ **Xem**: Chỉ xem, không thể sửa/xóa

### 7. Modal Chi Tiết Admin

#### Thông Tin Hiển Thị:
- **Tên**: Họ tên đầy đủ
- **Email**: Địa chỉ email
- **Số điện thoại**: Liên hệ
- **Địa điểm**: Thành phố làm việc
- **Ngày tham gia**: Ngày đăng ký
- **Vai trò**: Super Admin / Admin / Moderator
- **Trạng thái**: Đã duyệt / Chờ duyệt / Từ chối

#### Quyền Hạn:
Hiển thị 6 quyền với:
- ✅ Icon xanh: Có quyền
- ❌ Icon đỏ: Không có quyền

### 8. Modal Từ Chối Admin

#### Yêu Cầu:
- **Lý do từ chối**: Bắt buộc nhập (required)
- Minimum: 10 ký tự
- Textarea cho phép nhập nhiều dòng

#### Validation:
- Không cho phép submit nếu không có lý do
- Alert hiển thị nếu thiếu lý do

## Responsive Design

### Desktop (> 1024px)
- Hiển thị đầy đủ tất cả cột
- 4 stat cards trên 1 hàng
- Table rộng đầy đủ

### Tablet (768px - 1024px)
- 2 stat cards trên 1 hàng
- Table có horizontal scroll
- Filter buttons wrap

### Mobile (< 768px)
- 1 stat card trên 1 hàng
- Search box full width
- Filter buttons full width
- Table có horizontal scroll
- Modal full screen

## Bảo Mật

### Phân Quyền:
- Chỉ Super Admin và Admin có quyền "Manage Admins" mới truy cập được
- Super Admin không thể bị xóa
- Admin không thể tự xóa chính mình

### Audit Log:
- Tất cả thao tác được ghi log
- Lưu: Người thực hiện, Thời gian, Hành động

## Ngày Xét Duyệt

### Thời Gian Thực:
- **Ngày hiện tại**: 3/7/2026
- Tự động ghi nhận khi duyệt/từ chối
- Format: YYYY-MM-DD

## Tính Năng Bổ Sung Cho Web Tuyển Dụng

### 1. Activity Log
- Lịch sử hoạt động của admin
- Theo dõi ai làm gì, khi nào

### 2. Permission Templates
- Template quyền cho từng vai trò
- Nhanh chóng gán quyền

### 3. Bulk Actions
- Duyệt nhiều admin cùng lúc
- Từ chối hàng loạt

### 4. Email Notifications
- Thông báo khi được duyệt
- Thông báo khi bị từ chối (kèm lý do)

### 5. Admin Analytics
- Thống kê hoạt động admin
- Báo cáo hiệu suất

### 6. Two-Factor Authentication
- Bảo mật 2 lớp cho admin
- SMS hoặc Authenticator app

## Lưu Ý Quan Trọng

⚠️ **Cẩn thận khi:**
- Xóa admin (không thể khôi phục)
- Thay đổi quyền Super Admin
- Từ chối admin (cần lý do rõ ràng)

✅ **Nên:**
- Kiểm tra kỹ thông tin trước khi duyệt
- Ghi rõ lý do khi từ chối
- Backup dữ liệu định kỳ

❌ **Không nên:**
- Duyệt admin không rõ nguồn gốc
- Cho quá nhiều quyền cho Moderator
- Xóa admin đang hoạt động

## Hỗ Trợ

Nếu có vấn đề, liên hệ:
- Email: support@opporeview.com
- Hotline: 1900-xxxx
- Tài liệu: /docs/admin-management
