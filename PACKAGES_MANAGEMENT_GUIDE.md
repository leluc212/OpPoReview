# Hướng Dẫn Quản Lý Gói Dịch Vụ

## 🎯 Tổng Quan
Trang quản lý gói dịch vụ cho nhà tuyển dụng F&B với 4 gói: Quick Boost, Hot Search, Spotlight Banner, và Top Spotlight.

---

## 📦 4 Gói Dịch Vụ

### 1. Quick Boost ⚡
- **Màu sắc**: Xanh dương (#3b82f6)
- **Icon**: Zap (tia chớp)
- **Giá**: 500,000 VND
- **Mô tả**: Tăng tốc hiển thị tin tuyển dụng
- **Phù hợp**: Tuyển dụng nhanh, ngắn hạn

### 2. Hot Search 📈
- **Màu sắc**: Vàng cam (#f59e0b)
- **Icon**: TrendingUp
- **Giá**: 1,200,000 VND
- **Mô tả**: Xuất hiện trong kết quả tìm kiếm hàng đầu
- **Phù hợp**: Tăng độ phủ sóng, tiếp cận nhiều ứng viên

### 3. Spotlight Banner ⭐
- **Màu sắc**: Tím (#8b5cf6)
- **Icon**: Star
- **Giá**: 2,500,000 VND
- **Mô tả**: Banner nổi bật trên trang chủ
- **Phù hợp**: Quảng bá thương hiệu, vị trí quan trọng

### 4. Top Spotlight 🎁
- **Màu sắc**: Đỏ (#ef4444)
- **Icon**: Package
- **Giá**: 5,000,000 VND
- **Mô tả**: Vị trí cao nhất, ưu tiên tuyệt đối
- **Phù hợp**: Tuyển dụng cấp cao, chiến dịch lớn

---

## 📊 4 Card Thống Kê

### 1. Tổng Gói Đã Mua
- **Màu**: Xanh dương (#1e40af)
- **Hiển thị**: Tổng số gói đã được mua
- **Ví dụ**: 8 gói

### 2. Đang Hoạt Động
- **Màu**: Xanh lá (#10b981)
- **Hiển thị**: Số gói còn hiệu lực
- **Ví dụ**: 5 gói

### 3. Sắp Hết Hạn
- **Màu**: Vàng (#f59e0b)
- **Hiển thị**: Số gói sắp hết hạn (< 7 ngày)
- **Ví dụ**: 2 gói

### 4. Tổng Doanh Thu
- **Màu**: Tím (#8b5cf6)
- **Hiển thị**: Tổng giá trị các gói đã bán
- **Ví dụ**: 15.2M VND

---

## 📈 Biểu Đồ Cột - Số Lượng Gói Mua Theo Tháng

### Đặc Điểm
- **Hiển thị**: 6 tháng gần nhất
- **Dữ liệu**: 4 cột cho mỗi tháng (4 loại gói)
- **Màu sắc**: Mỗi gói có màu riêng
- **Giá trị**: Hiển thị số lượng trên đầu mỗi cột
- **Hover**: Xem chi tiết từng gói

### Cấu Trúc
```
Tháng 9/23: QB(8) | HS(5) | SB(3) | TS(2)
Tháng 10/23: QB(12) | HS(7) | SB(4) | TS(3)
Tháng 11/23: QB(15) | HS(9) | SB(6) | TS(4)
Tháng 12/23: QB(18) | HS(11) | SB(7) | TS(5)
Tháng 1/24: QB(22) | HS(14) | SB(9) | TS(6)
Tháng 2/24: QB(25) | HS(16) | SB(11) | TS(8)
```

### Phân Tích
- **Xu hướng**: Tăng trưởng đều qua các tháng
- **Gói phổ biến nhất**: Quick Boost (giá rẻ, dễ tiếp cận)
- **Gói cao cấp**: Top Spotlight tăng dần (thương hiệu lớn)

### Legend
- 🔵 Quick Boost
- 🟡 Hot Search
- 🟣 Spotlight Banner
- 🔴 Top Spotlight

---

## 🥧 Biểu Đồ Tròn - Phân Bố Gói Dịch Vụ

### Đặc Điểm
- **Hiển thị**: Tỷ lệ % mỗi gói trong tổng số
- **Màu sắc**: Giống biểu đồ cột
- **Legend**: Tên gói + số lượng + phần trăm
- **Interactive**: Hover để xem chi tiết

### Dữ Liệu Mẫu
- Quick Boost: 2 gói (25%)
- Hot Search: 2 gói (25%)
- Spotlight Banner: 2 gói (25%)
- Top Spotlight: 2 gói (25%)

### Phân Tích
- Phân bố đều giữa các gói
- Cho thấy nhu cầu đa dạng
- Cả gói rẻ và đắt đều có thị trường

---

## 📋 Bảng Dữ Liệu Chi Tiết

### Các Cột

#### 1. Nhà Tuyển Dụng
- Tên công ty F&B
- Font đậm, dễ nhận diện
- **Ví dụ**: Highlands Coffee, Phúc Long, Katinat

#### 2. Gói Dịch Vụ
- Badge màu sắc với icon
- Phân biệt rõ ràng
- **Ví dụ**: ⚡ Quick Boost, 📈 Hot Search

#### 3. Thời Gian Mua
- Ngày mua gói
- Icon lịch 📅
- **Format**: YYYY-MM-DD

#### 4. Hết Hạn
- Ngày hết hạn gói
- Icon đồng hồ ⏰
- **Format**: YYYY-MM-DD

#### 5. Thời Hạn
- Thời gian sử dụng
- Font đậm
- **Ví dụ**: 30 ngày, 60 ngày, 90 ngày

#### 6. Giá Trị
- Giá gói dịch vụ
- Icon dollar 💵
- **Format**: 500K, 1.2M, 2.5M, 5M

#### 7. Tình Trạng
- Badge màu sắc
- 3 trạng thái:
  - 🟢 **Đang hoạt động**: Còn hiệu lực
  - 🟡 **Sắp hết hạn**: < 7 ngày
  - 🔴 **Đã hết hạn**: Quá hạn sử dụng

#### 8. Thao Tác
- 👁️ Xem chi tiết hợp đồng

---

## 📊 Dữ Liệu Mẫu (8 Gói)

### Đang Hoạt Động (5 gói)
1. **Highlands Coffee** - Quick Boost - 500K - 30 ngày
2. **Phúc Long** - Hot Search - 1.2M - 60 ngày
3. **Katinat** - Spotlight Banner - 2.5M - 90 ngày
4. **Starbucks** - Top Spotlight - 5M - 90 ngày
5. **Gong Cha** - Spotlight Banner - 2.5M - 90 ngày

### Sắp Hết Hạn (2 gói)
6. **Bami Bread** - Quick Boost - 500K - 7 ngày
7. **Trung Nguyên** - Hot Search - 1.2M - 30 ngày

### Đã Hết Hạn (1 gói)
8. **The Coffee House** - Top Spotlight - 5M - 30 ngày

---

## 🔍 Tìm Kiếm & Lọc

### Tìm Kiếm
- Theo tên nhà tuyển dụng
- Theo tên gói dịch vụ
- Real-time search

### Bộ Lọc
**Theo Gói**:
- Quick Boost
- Hot Search
- Spotlight Banner
- Top Spotlight

**Theo Trạng Thái**:
- Đang hoạt động
- Sắp hết hạn
- Đã hết hạn

---

## 💡 Gợi Ý Bổ Sung Đã Triển Khai

### 1. Thống Kê Doanh Thu
- ✅ Tổng doanh thu từ tất cả gói
- ✅ Hiển thị ở card thống kê
- ✅ Format: triệu VND (M)

### 2. Phân Tích Xu Hướng
- ✅ Biểu đồ cột theo tháng
- ✅ Thấy rõ tăng trưởng
- ✅ So sánh giữa các gói

### 3. Cảnh Báo Hết Hạn
- ✅ Trạng thái "Sắp hết hạn"
- ✅ Badge màu vàng nổi bật
- ✅ Dễ dàng theo dõi

### 4. Phân Loại Rõ Ràng
- ✅ Icon riêng cho mỗi gói
- ✅ Màu sắc phân biệt
- ✅ Badge đẹp mắt

### 5. Thời Hạn Linh Hoạt
- ✅ 7 ngày, 30 ngày, 60 ngày, 90 ngày
- ✅ Hiển thị rõ ràng
- ✅ Dễ so sánh

---

## 🎨 Giao Diện

### Màu Sắc Gói
- **Quick Boost**: Xanh dương (#3b82f6) - Nhanh, hiệu quả
- **Hot Search**: Vàng cam (#f59e0b) - Nóng, trending
- **Spotlight Banner**: Tím (#8b5cf6) - Cao cấp, nổi bật
- **Top Spotlight**: Đỏ (#ef4444) - VIP, ưu tiên cao nhất

### Màu Sắc Trạng Thái
- **Đang hoạt động**: Xanh lá (#10b981)
- **Sắp hết hạn**: Vàng (#f59e0b)
- **Đã hết hạn**: Đỏ (#ef4444)

### Hiệu Ứng
- Hover trên hàng: Đổi màu nền
- Hover trên cột biểu đồ: Scale up
- Hover trên legend: Dịch chuyển phải
- Badge: Bo tròn, gradient nhẹ

---

## 📱 Responsive Design

### Desktop (> 1024px)
- 4 card thống kê trên 1 hàng
- 2 biểu đồ cạnh nhau (2:1)
- Bảng hiển thị đầy đủ

### Tablet (768px - 1024px)
- 2 card thống kê trên 1 hàng
- 2 biểu đồ xếp dọc
- Bảng scroll ngang

### Mobile (< 768px)
- 1 card thống kê trên 1 hàng
- Biểu đồ xếp dọc
- Bảng scroll ngang

---

## 🌐 Đa Ngôn Ngữ

### Tiếng Việt
- Quản Lý Gói Dịch Vụ
- Nhà tuyển dụng F&B
- Tất cả label và trạng thái

### Tiếng Anh
- Package Management
- F&B Employers
- All labels and statuses

---

## 🚀 Cách Sử Dụng

1. **Truy cập**: `/admin/packages`
2. **Xem thống kê**: 4 card ở đầu trang
3. **Phân tích xu hướng**: Biểu đồ cột theo tháng
4. **Xem phân bố**: Biểu đồ tròn
5. **Tìm kiếm**: Nhập tên nhà tuyển dụng hoặc gói
6. **Lọc**: Click vào filter badge
7. **Xem chi tiết**: Click nút mắt

---

## 📊 Insights & Analytics

### Xu Hướng Tăng Trưởng
- Quick Boost tăng 212% (8→25) trong 6 tháng
- Hot Search tăng 220% (5→16) trong 6 tháng
- Spotlight Banner tăng 267% (3→11) trong 6 tháng
- Top Spotlight tăng 300% (2→8) trong 6 tháng

### Phân Khúc Khách Hàng
- **Gói rẻ (Quick Boost)**: Nhà hàng nhỏ, quán cà phê
- **Gói trung (Hot Search)**: Chuỗi cà phê vừa
- **Gói cao (Spotlight)**: Thương hiệu lớn
- **Gói VIP (Top Spotlight)**: Tập đoàn F&B

### Tỷ Lệ Gia Hạn
- Đang hoạt động: 62.5% (5/8)
- Sắp hết hạn: 25% (2/8)
- Đã hết hạn: 12.5% (1/8)

---

## 🎯 Kết Luận

Trang quản lý gói dịch vụ đã được triển khai đầy đủ với:
- ✅ 4 gói dịch vụ với màu sắc & icon riêng
- ✅ Thông tin nhà tuyển dụng F&B
- ✅ Thời gian mua & hết hạn
- ✅ Tình trạng hợp đồng (3 trạng thái)
- ✅ Biểu đồ cột phân tích theo tháng
- ✅ Biểu đồ tròn phân bố gói
- ✅ 4 card thống kê
- ✅ Tìm kiếm & lọc
- ✅ Responsive design
- ✅ Đa ngôn ngữ

**Đường dẫn**: `/admin/packages`
