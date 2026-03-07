# Tính Năng Trang Quản Lý Người Dùng

## 🎯 Tổng Quan
Trang quản lý người dùng được chia thành 2 tab riêng biệt: **Ứng Viên** và **Nhà Tuyển Dụng**

---

## ✅ Tab 1: Quản Lý Ứng Viên

### 📊 4 Card Thống Kê
1. **Tổng ứng viên** - Màu xanh dương (#1e40af)
2. **Đã duyệt** - Màu xanh lá (#10b981)
3. **Chờ duyệt** - Màu vàng (#f59e0b)
4. **Đã xác thực eKYC** - Màu tím (#8b5cf6)

### 📋 Bảng Dữ Liệu Ứng Viên
Các cột hiển thị:
- **Tên ứng viên** - Font đậm, dễ nhận diện
- **Email** - Địa chỉ email liên hệ
- **eKYC (4 bước)** - Badge hiển thị:
  - ✅ Màu xanh với icon CheckSquare: "Đã xác thực"
  - ❌ Màu đỏ với icon XSquare: "Chưa xác thực"
- **Trạng thái duyệt** - Badge màu sắc:
  - 🟢 Xanh lá: "Đã duyệt"
  - 🟡 Vàng: "Chờ duyệt"
  - 🔴 Đỏ: "Không duyệt"
- **Ngày tham gia** - Định dạng YYYY-MM-DD
- **Ngày phỏng vấn** - Hiển thị với icon lịch, màu xanh nổi bật
  - Nếu chưa có: "Chưa có" (màu xám)

### 🔍 Tìm Kiếm & Lọc
- **Tìm kiếm**: Theo tên hoặc email
- **Bộ lọc**:
  - Đã duyệt
  - Chờ duyệt
  - Không duyệt
  - Đã xác thực
  - Chưa xác thực

### 🎬 Nút Thao Tác
1. **👁️ Xem chi tiết** - Màu xanh dương
2. **✅ Phê duyệt** - Màu xanh lá (chỉ hiện với trạng thái "Chờ duyệt")
3. **🚫 Từ chối** - Màu đỏ (chỉ hiện với trạng thái "Chờ duyệt")
4. **🗑️ Xóa** - Màu đỏ

---

## ✅ Tab 2: Quản Lý Nhà Tuyển Dụng

### 📊 4 Card Thống Kê
1. **Tổng nhà tuyển dụng** - Màu xanh dương (#1e40af)
2. **Đã duyệt** - Màu xanh lá (#10b981)
3. **Chờ duyệt** - Màu vàng (#f59e0b)
4. **Đã xác thực** - Màu tím (#8b5cf6)

### 📋 Bảng Dữ Liệu Nhà Tuyển Dụng
Các cột hiển thị:
- **Tên nhà tuyển dụng** - Font đậm
- **Email** - Địa chỉ email công ty
- **Trạng thái phê duyệt** - Badge màu sắc:
  - 🟢 Xanh lá: "Đã duyệt"
  - 🟡 Vàng: "Chờ duyệt"
  - 🔴 Đỏ: "Không duyệt"
- **Ngày tham gia** - Ngày đăng ký
- **Ngày hẹn phỏng vấn** - Với icon lịch
  - Nếu chưa có: "Chưa có" (màu xám)
- **Đã xác thực** - Badge hiển thị:
  - 🛡️ Màu xanh với icon Shield: "Đã xác thực"
  - ❌ Màu đỏ với icon XSquare: "Chưa xác thực"

### 🔍 Tìm Kiếm & Lọc
- **Tìm kiếm**: Theo tên công ty hoặc email
- **Bộ lọc**:
  - Đã duyệt
  - Chờ duyệt
  - Không duyệt
  - Đã xác thực
  - Chưa xác thực

### 🎬 Nút Thao Tác
1. **👁️ Xem chi tiết** - Màu xanh dương
2. **✅ Phê duyệt** - Màu xanh lá (chỉ hiện với trạng thái "Chờ duyệt")
3. **🚫 Từ chối** - Màu đỏ (chỉ hiện với trạng thái "Chờ duyệt")
4. **🗑️ Xóa** - Màu đỏ

---

## 🎨 Giao Diện & Thiết Kế

### Màu Sắc Phân Biệt Rõ Ràng
- **Xanh dương (#1e40af)**: Thông tin chính, tab active
- **Xanh lá (#10b981)**: Trạng thái tích cực (đã duyệt, đã xác thực)
- **Vàng (#f59e0b)**: Trạng thái chờ xử lý
- **Đỏ (#dc2626)**: Trạng thái tiêu cực (từ chối, chưa xác thực)
- **Tím (#8b5cf6)**: Thông tin đặc biệt (xác thực)

### Hiệu Ứng Tương Tác
- **Hover trên hàng**: Đổi màu nền, dễ nhận diện
- **Hover trên nút**: Scale 1.1x, thêm shadow
- **Tab active**: Border dưới màu xanh dương, font đậm
- **Badge**: Bo tròn, màu sắc rõ ràng với icon

### Typography
- **Tiêu đề trang**: 32px, font đậm
- **Tiêu đề cột**: 13px, uppercase, letter-spacing
- **Nội dung bảng**: 14px
- **Badge**: 12px, font đậm

---

## 📱 Responsive Design

### Desktop (> 1024px)
- 4 card thống kê trên 1 hàng
- Bảng hiển thị đầy đủ tất cả cột
- Khoảng cách thoải mái

### Tablet (768px - 1024px)
- 2 card thống kê trên 1 hàng
- Bảng có thể scroll ngang
- Giữ nguyên chức năng

### Mobile (< 768px)
- 1 card thống kê trên 1 hàng
- Bảng scroll ngang
- Nút thao tác thu gọn

---

## 🌐 Đa Ngôn Ngữ

### Tiếng Việt
- Tất cả label, button, message
- Định dạng ngày tháng
- Trạng thái và badge

### Tiếng Anh
- Chuyển đổi mượt mà
- Giữ nguyên layout
- Không ảnh hưởng chức năng

**Cách chuyển đổi**: Sử dụng LanguageSwitcher component ở góc trên

---

## 📊 Dữ Liệu Mẫu

### Ứng Viên (5 người)
1. Nguyễn Văn A - Đã xác thực eKYC, Đã duyệt
2. Trần Thị B - Đã xác thực eKYC, Chờ duyệt
3. Lê Văn C - Chưa xác thực eKYC, Không duyệt
4. Phạm Thị D - Đã xác thực eKYC, Đã duyệt
5. Hoàng Văn E - Chưa xác thực eKYC, Chờ duyệt

### Nhà Tuyển Dụng (5 công ty)
1. FPT Software - Đã xác thực, Đã duyệt
2. Viettel Group - Đã xác thực, Đã duyệt
3. Công ty TNHH ABC - Chưa xác thực, Chờ duyệt
4. VinGroup - Đã xác thực, Đã duyệt
5. Shopee Vietnam - Chưa xác thực, Không duyệt

---

## 🚀 Cách Sử Dụng

1. **Truy cập**: Đăng nhập với tài khoản Admin → `/admin/users`
2. **Chọn tab**: Click vào "Ứng Viên" hoặc "Nhà Tuyển Dụng"
3. **Xem thống kê**: 4 card ở đầu trang
4. **Tìm kiếm**: Nhập tên hoặc email vào ô tìm kiếm
5. **Lọc**: Click vào các filter badge để lọc
6. **Thao tác**: Click vào các nút icon để thực hiện hành động

---

## 🔧 Công Nghệ Sử Dụng

- **React 18** - UI Framework
- **Styled Components** - CSS-in-JS
- **Lucide React** - Icon library
- **Context API** - Language management
- **useMemo** - Performance optimization

---

## 📝 Ghi Chú

- Dữ liệu hiện tại là mock data
- Cần tích hợp API backend để có dữ liệu thực
- Các nút thao tác chưa có logic xử lý (cần implement)
- Có thể mở rộng thêm modal xem chi tiết người dùng

---

## 🎯 Kết Luận

Trang quản lý người dùng đã được triển khai đầy đủ với:
- ✅ 2 tab riêng biệt cho Ứng viên và Nhà tuyển dụng
- ✅ 4 card thống kê cho mỗi tab
- ✅ Tìm kiếm và lọc theo nhiều tiêu chí
- ✅ Nút thao tác đầy đủ
- ✅ Giao diện đẹp với màu sắc phân biệt
- ✅ Responsive design
- ✅ Hỗ trợ đa ngôn ngữ

**Server đang chạy tại**: http://localhost:3001/
**Đường dẫn**: `/admin/users`
