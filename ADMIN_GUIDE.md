# Hướng Dẫn Sử Dụng Trang Admin

## Tổng Quan

Hệ thống quản trị dành cho Admin bao gồm các tính năng quản lý toàn diện cho nền tảng tuyển dụng.

## Các Trang Chính

### 1. Dashboard (Trang Tổng Quan)
**Đường dẫn:** `/admin/dashboard`

**Tính năng:**
- Hiển thị thống kê tổng quan: Tổng người dùng, Tin đang tuyển, Công ty, Doanh thu
- Bảng hoạt động gần đây của người dùng
- Biểu đồ trực quan với màu sắc gradient đẹp mắt

**Thống kê hiển thị:**
- Tổng Người Dùng: 2,458 (+12% so với tháng trước)
- Tin Đang Tuyển: 345 (+8% so với tuần trước)
- Công Ty: 156 (15 đang chờ duyệt)
- Doanh Thu: 24.5 tỷ VND (+23% so với tháng trước)

---

### 2. Quản Lý Người Dùng (User Management)
**Đường dẫn:** `/admin/users`

**Tính năng:**
- Xem danh sách tất cả người dùng (Ứng viên & Nhà tuyển dụng)
- Tìm kiếm người dùng theo tên, email
- Lọc theo vai trò (Ứng viên, Nhà tuyển dụng) và trạng thái (Hoạt động, Chờ duyệt, Đã khóa)
- Xem chi tiết thông tin người dùng
- Khóa/Kích hoạt tài khoản
- Xóa người dùng

**Thống kê:**
- Tổng người dùng
- Số lượng ứng viên
- Số lượng nhà tuyển dụng
- Số tài khoản chờ duyệt

**Chi tiết người dùng bao gồm:**
- Thông tin cơ bản: Tên, Email, Số điện thoại
- Địa điểm
- Ngày tham gia
- Đối với Ứng viên: Số việc đã ứng tuyển, Số việc đã lưu
- Đối với Nhà tuyển dụng: Số tin đã đăng, Số tin đang tuyển

**Thao tác:**
- 👁️ Xem chi tiết
- 🚫 Khóa tài khoản (nếu đang hoạt động)
- ✅ Kích hoạt (nếu đã bị khóa)
- 🗑️ Xóa tài khoản

---

### 3. Duyệt Nhà Tuyển Dụng (Employer Approval)
**Đường dẫn:** `/admin/employers`

**Tính năng:**
- Xem danh sách nhà tuyển dụng chờ duyệt
- Xem chi tiết hồ sơ xác thực công ty
- Phê duyệt hoặc từ chối hồ sơ
- Tìm kiếm và lọc theo ngành nghề

**Hồ sơ xác thực bao gồm:**

**Bước 1: Giấy Phép Kinh Doanh**
- Số giấy phép
- Cơ quan cấp
- Ngày cấp & ngày hết hạn
- File đính kèm

**Bước 2: Thông Tin Doanh Nghiệp**
- Tên công ty (Tiếng Việt & Tiếng Anh)
- Mã số thuế
- Năm thành lập
- Ngành nghề
- Quy mô
- Website
- Mô tả

**Bước 3: Người Đại Diện Pháp Luật**
- Họ tên
- Chức vụ
- Số CMND/CCCD
- Ảnh CMND/CCCD (mặt trước & sau)
- Giấy ủy quyền (nếu có)

**Bước 4: Thông Tin Liên Hệ**
- Địa chỉ đầy đủ
- Tỉnh/Thành phố, Quận/Huyện, Phường/Xã
- Số điện thoại
- Email liên hệ
- Liên hệ khẩn cấp

**Thao tác:**
- 👁️ Xem chi tiết hồ sơ
- ✅ Phê duyệt
- ❌ Từ chối

---

### 4. Phân Tích Dữ Liệu (Data Analysis)
**Đường dẫn:** `/admin/analytics`

**Các tab phân tích:**

#### Tab 1: Tổng Quan (Overview)
- Tổng người dùng: 2,458
- Tin đang tuyển: 345
- Ứng tuyển: 1,234
- Doanh thu tháng: 24.5M VND
- Biểu đồ người dùng mới theo thời gian
- Biểu đồ tin tuyển dụng theo ngành
- Bảng hoạt động gần đây

#### Tab 2: Người Dùng (Users)
- Số lượng ứng viên: 1,856
- Số lượng nhà tuyển dụng: 602
- Người dùng hoạt động: 1,234
- Chờ xác thực: 45
- Biểu đồ tăng trưởng người dùng
- Biểu đồ phân bố người dùng

#### Tab 3: Việc Làm (Jobs)
- Tổng tin tuyển dụng: 1,245
- Đang tuyển: 345
- Lượt xem: 45.2K
- Ứng tuyển: 8,456
- Bảng top tin tuyển dụng

#### Tab 4: Doanh Thu (Revenue)
- Doanh thu tháng: 24.5M VND
- Gói đăng ký: 156
- Doanh thu quảng cáo: 8.2M VND
- Trung bình/giao dịch: 450K VND
- Biểu đồ doanh thu theo thời gian
- Biểu đồ nguồn doanh thu

#### Tab 5: Tương Tác (Engagement)
- Lượt truy cập: 125.4K
- Thời gian trung bình: 8m 34s
- Tỷ lệ tương tác: 68.5%
- Tỷ lệ chuyển đổi: 12.8%
- Biểu đồ hoạt động người dùng
- Biểu đồ tương tác theo giờ

**Bộ lọc:**
- Khoảng thời gian: 7 ngày, 30 ngày, 3 tháng, Năm nay, Tùy chỉnh

---

## Tính Năng Chung

### Tìm Kiếm & Lọc
- Tìm kiếm theo từ khóa
- Lọc theo nhiều tiêu chí
- Kết quả cập nhật real-time

### Giao Diện
- Responsive design - tương thích mọi thiết bị
- Dark mode support
- Hiệu ứng hover và animation mượt mà
- Màu sắc gradient đẹp mắt

### Đa Ngôn Ngữ
- Hỗ trợ Tiếng Việt và Tiếng Anh
- Chuyển đổi ngôn ngữ dễ dàng

---

## Quyền Truy Cập

Chỉ tài khoản có vai trò `admin` mới có thể truy cập các trang này.

**Đăng nhập với vai trò Admin:**
- Email: admin@example.com
- Password: (theo cấu hình)

---

## Công Nghệ Sử Dụng

- **React 18** - UI Framework
- **React Router** - Routing
- **Styled Components** - Styling
- **Lucide React** - Icons
- **Context API** - State Management

---

## Lưu Ý

1. Dữ liệu hiện tại là dữ liệu mẫu (mock data)
2. Cần tích hợp API backend để có dữ liệu thực
3. Hồ sơ xác thực công ty được lưu trong localStorage
4. Tự động reload danh sách xác thực mỗi 5 giây

---

## Hỗ Trợ

Nếu cần hỗ trợ, vui lòng liên hệ team phát triển.
