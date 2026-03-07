# Tính Năng Duyệt Nhà Tuyển Dụng

## 🎯 Tổng Quan
Tab "Duyệt NTD" được thêm vào trang Quản Lý Người Dùng để xử lý các yêu cầu xác thực từ nhà tuyển dụng.

---

## ✨ Tính Năng Chính

### 1. Tab Duyệt Nhà Tuyển Dụng
- Icon: ⏰ Clock
- Badge: Số lượng chờ duyệt (màu vàng)
- Vị trí: Tab thứ 3 sau "Ứng Viên" và "Nhà Tuyển Dụng"

### 2. 4 Card Thống Kê
- **Tổng chờ duyệt**: Số hồ sơ đang chờ
- **Điểm cao (≥80)**: Hồ sơ chất lượng tốt
- **Rủi ro thấp**: Đánh giá an toàn
- **Hồ sơ đầy đủ**: Đã nộp đủ giấy tờ

### 3. Bảng Danh Sách Chờ Duyệt

#### Các Cột:
1. **Tên công ty** (Vi/En)
2. **Email & Số điện thoại**
3. **Mã số thuế**
4. **Ngành nghề**
5. **Điểm xác thực** (0-100)
   - ≥80: Xanh lá (Tốt)
   - 60-79: Vàng (Trung bình)
   - <60: Đỏ (Cần xem xét)
6. **Mức độ rủi ro**
   - Thấp: Xanh lá
   - Trung bình: Vàng
   - Cao: Đỏ
7. **Hồ sơ**
   - ✅ Đầy đủ
   - ⚠️ Thiếu
8. **Ngày nộp**
9. **Thao tác**

---

## 🔍 Tính Năng Bổ Trợ

### 1. Hệ Thống Chấm Điểm Tự Động (0-100)

**Tiêu chí đánh giá:**
- ✅ Giấy phép kinh doanh hợp lệ: +20 điểm
- ✅ Thông tin công ty đầy đủ: +15 điểm
- ✅ Đại diện pháp luật xác thực: +15 điểm
- ✅ Địa chỉ liên hệ rõ ràng: +10 điểm
- ✅ Website hoạt động: +10 điểm
- ✅ Mã số thuế hợp lệ: +10 điểm
- ✅ Năm thành lập > 2 năm: +10 điểm
- ✅ Quy mô công ty rõ ràng: +5 điểm
- ✅ Ngành nghề phù hợp: +5 điểm

**Phân loại:**
- 80-100: Ưu tiên duyệt (Xanh lá)
- 60-79: Xem xét kỹ (Vàng)
- <60: Cần bổ sung (Đỏ)

### 2. Đánh Giá Rủi Ro Tự Động

**Mức độ rủi ro:**

**Thấp (Low):**
- Công ty lớn, uy tín
- Đầy đủ giấy tờ
- Website chính thức
- Thông tin nhất quán

**Trung bình (Medium):**
- Công ty mới (< 2 năm)
- Thiếu 1-2 giấy tờ
- Thông tin chưa đầy đủ

**Cao (High):**
- Thông tin mâu thuẫn
- Thiếu nhiều giấy tờ
- Không có website
- Địa chỉ không rõ ràng

### 3. Modal Xem Chi Tiết Hồ Sơ

**4 Phần Thông Tin:**

#### A. Thông Tin Công Ty
- Tên công ty (Vi/En)
- Mã số thuế
- Năm thành lập
- Ngành nghề
- Quy mô
- Website
- Mô tả

#### B. Giấy Phép Kinh Doanh
- Số giấy phép
- Cơ quan cấp
- Ngày cấp
- Ngày hết hạn
- Link tải file

#### C. Người Đại Diện
- Họ tên
- Chức vụ
- Số CMND/CCCD
- Link tải CMND mặt trước/sau
- Giấy ủy quyền (nếu có)

#### D. Địa Chỉ Liên Hệ
- Địa chỉ đầy đủ
- Tỉnh/Thành phố
- Quận/Huyện
- Phường/Xã
- Số điện thoại
- Email

### 4. Các Nút Thao Tác

#### Trong Bảng:
- **👁️ Xem chi tiết**: Mở modal xem đầy đủ

#### Trong Modal:
- **✅ Phê duyệt**: Duyệt ngay lập tức
- **❌ Từ chối**: Yêu cầu nhập lý do
- **📝 Yêu cầu bổ sung**: Gửi thông báo cần thêm thông tin
- **📥 Tải hồ sơ**: Download tất cả giấy tờ
- **💬 Gửi tin nhắn**: Liên hệ trực tiếp

### 5. Lý Do Từ Chối

**Textarea để nhập:**
- Bắt buộc khi từ chối
- Tối thiểu 20 ký tự
- Gửi email tự động cho NTD
- Lưu vào lịch sử

**Lý do phổ biến:**
- Giấy tờ không hợp lệ
- Thông tin không chính xác
- Công ty không tồn tại
- Ngành nghề không phù hợp
- Thiếu giấy phép kinh doanh

### 6. Yêu Cầu Bổ Sung Thông Tin

**Checklist:**
- ☐ Giấy phép kinh doanh
- ☐ CMND/CCCD đại diện
- ☐ Giấy ủy quyền
- ☐ Xác nhận địa chỉ
- ☐ Thông tin website
- ☐ Khác (ghi rõ)

**Hành động:**
- Gửi email thông báo
- Đặt trạng thái "Chờ bổ sung"
- Deadline: 7 ngày
- Nhắc nhở tự động sau 5 ngày

### 7. Lịch Sử Xử Lý

**Lưu trữ:**
- Người xử lý
- Thời gian xử lý
- Hành động (Duyệt/Từ chối/Yêu cầu BS)
- Lý do (nếu có)
- Ghi chú

### 8. Thông Báo Tự Động

**Khi phê duyệt:**
- Email chúc mừng
- Hướng dẫn bước tiếp theo
- Link đăng tin tuyển dụng

**Khi từ chối:**
- Email thông báo
- Lý do cụ thể
- Hướng dẫn khắc phục
- Có thể nộp lại sau 30 ngày

**Khi yêu cầu bổ sung:**
- Email yêu cầu
- Danh sách cần bổ sung
- Deadline
- Link upload

### 9. Bộ Lọc Nâng Cao

**Lọc theo:**
- Điểm xác thực (Cao/Trung bình/Thấp)
- Mức độ rủi ro (Thấp/TB/Cao)
- Hồ sơ (Đầy đủ/Thiếu)
- Ngành nghề
- Quy mô công ty
- Thời gian nộp (Mới nhất/Cũ nhất)

### 10. Xuất Báo Cáo

**Định kỳ:**
- Số lượng chờ duyệt
- Số lượng đã duyệt
- Số lượng từ chối
- Thời gian xử lý trung bình
- Tỷ lệ duyệt/từ chối
- Top ngành nghề

**Format:**
- Excel (.xlsx)
- PDF
- CSV

---

## 📊 Dữ Liệu Mẫu (3 Hồ Sơ)

### 1. Highlands Coffee ⭐
- **Điểm**: 95/100 (Xuất sắc)
- **Rủi ro**: Thấp
- **Hồ sơ**: Đầy đủ
- **Đánh giá**: Ưu tiên duyệt ngay
- **Lý do**: Thương hiệu lớn, giấy tờ đầy đủ

### 2. Phúc Long Coffee ✅
- **Điểm**: 88/100 (Tốt)
- **Rủi ro**: Thấp
- **Hồ sơ**: Đầy đủ
- **Đánh giá**: Có thể duyệt
- **Lý do**: Chuỗi uy tín, thông tin rõ ràng

### 3. Công ty XYZ ⚠️
- **Điểm**: 65/100 (Trung bình)
- **Rủi ro**: Trung bình
- **Hồ sơ**: Thiếu
- **Đánh giá**: Cần xem xét kỹ
- **Lý do**: Công ty mới, thiếu giấy ủy quyền

---

## 🎨 Giao Diện

### Màu Sắc Điểm Số
- **80-100**: Xanh lá (#10b981) - Tốt
- **60-79**: Vàng (#f59e0b) - Trung bình
- **0-59**: Đỏ (#ef4444) - Kém

### Màu Sắc Rủi Ro
- **Thấp**: Xanh lá (#10b981)
- **Trung bình**: Vàng (#f59e0b)
- **Cao**: Đỏ (#ef4444)

### Badge Hồ sơ
- **Đầy đủ**: ✅ Xanh lá
- **Thiếu**: ⚠️ Vàng

---

## 🚀 Workflow Xử Lý

```
1. NTD nộp hồ sơ
   ↓
2. Hệ thống chấm điểm tự động
   ↓
3. Đánh giá rủi ro tự động
   ↓
4. Hiển thị trong tab "Duyệt NTD"
   ↓
5. Admin xem chi tiết
   ↓
6. Quyết định:
   - Phê duyệt → Email chúc mừng
   - Từ chối → Email + lý do
   - Yêu cầu BS → Email + checklist
   ↓
7. Lưu lịch sử
   ↓
8. Cập nhật thống kê
```

---

## 💡 Lợi Ích

### Cho Admin:
- ✅ Xử lý nhanh chóng
- ✅ Đánh giá khách quan
- ✅ Giảm sai sót
- ✅ Theo dõi dễ dàng
- ✅ Báo cáo tự động

### Cho Nhà Tuyển Dụng:
- ✅ Quy trình minh bạch
- ✅ Phản hồi nhanh
- ✅ Biết rõ lý do từ chối
- ✅ Hướng dẫn cụ thể
- ✅ Có thể bổ sung

---

## 🎯 Kết Luận

Tab "Duyệt NTD" cung cấp:
- ✅ Hệ thống chấm điểm tự động
- ✅ Đánh giá rủi ro thông minh
- ✅ Modal xem chi tiết đầy đủ
- ✅ 3 hành động: Duyệt/Từ chối/Yêu cầu BS
- ✅ Lý do từ chối bắt buộc
- ✅ Thông báo email tự động
- ✅ Lịch sử xử lý
- ✅ Bộ lọc nâng cao
- ✅ Xuất báo cáo
- ✅ Workflow rõ ràng

**Đường dẫn**: `/admin/users` → Tab "Duyệt NTD"
