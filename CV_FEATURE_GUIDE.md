# Hướng dẫn sử dụng tính năng CV Manager

## 🎯 Tổng quan

Hệ thống đã được cập nhật với tính năng quản lý và xem CV PDF cho nhà tuyển dụng. CV mẫu sẽ được tự động tạo cho các ứng viên khi trang được load.

## 📦 Files đã tạo/cập nhật

### 1. **src/utils/sampleCVGenerator.js** (MỚI)
Utility để tạo CV mẫu tự động cho demo:
- `createSamplePDFData(name, jobTitle)`: Tạo CV dạng SVG cho từng ứng viên
- `initializeMultipleSampleCVs()`: Tạo CV cho nhiều ứng viên cùng lúc

### 2. **src/pages/employer/Applications.jsx** (CẬP NHẬT)
Thêm các tính năng:
- Import `MessageSquare` icon
- Import `sampleCVGenerator` utility
- useEffect để auto-load CV mẫu khi component mount
- Update logic load CV theo ID ứng viên: `candidateCV_${candidate.id}`

### 3. **public/sample-cv.html** (MỚI)
File HTML template cho CV mẫu với:
- Header gradient đẹp
- Sections: Mục tiêu, Kinh nghiệm, Học vấn, Kỹ năng, Chứng chỉ
- Responsive design
- Professional styling

## 🚀 Cách sử dụng

### Bước 1: Khởi động ứng dụng
```bash
npm run dev
```

### Bước 2: Đăng nhập với tài khoản Employer
Truy cập: `http://localhost:3000/OpPoReview/employer/standard-jobs`

### Bước 3: Xem danh sách ứng viên
1. Chọn tab **"Hồ sơ ứng tuyển"** (Applications)
2. Danh sách hiển thị các ứng viên:
   - Đỗ Hoàng Hiếu (Store Manager) - **CÓ CV**
   - Phạm Lê Duy (Cashier) - **CÓ CV**
   - Trần Phương Tuấn (Barista) - **CÓ CV**

### Bước 4: Xem CV chi tiết
1. Click nút **"Xem hồ sơ"** trên bất kỳ ứng viên nào
2. Modal hiển thị:
   - Thông tin cá nhân
   - Kinh nghiệm, học vấn, kỹ năng
   - **Section CV** với:
     - Thông tin file (tên, size, ngày upload)
     - Nút "Tải xuống" (Download)
     - Nút "Xem trước CV" (Preview)

### Bước 5: Xem trước và phản hồi CV
1. Click **"Xem trước CV"**
2. PDF viewer mở ra với CV đầy đủ
3. Scroll để xem toàn bộ nội dung
4. Phía dưới có form **"Phản hồi & Đánh giá"**:
   - Ô textarea để nhập ghi chú
   - 3 nút hành động:
     - ✓ **Chấp nhận** (xanh lá)
     - 💾 **Lưu ghi chú** (xanh dương)
     - ✗ **Từ chối** (đỏ)

## 💡 Chi tiết kỹ thuật

### Data Structure trong localStorage

```javascript
// CV của từng ứng viên
localStorage.setItem('candidateCV_1', JSON.stringify({
  name: "CV_Do_Hoang_Hieu.pdf",
  size: 2847,
  uploadDate: "2026-03-09T...",
  data: "data:image/svg+xml;base64,..." // SVG converted to base64
}));

// Feedback của NTD
localStorage.setItem('feedback_1', JSON.stringify({
  note: "Ứng viên có kinh nghiệm tốt, phù hợp với vị trí...",
  status: "approved", // hoặc "rejected"
  date: "2026-03-09T..."
}));
```

### Flow hoạt động

```
1. Page Load (Applications.jsx mount)
   ↓
2. useEffect chạy initializeMultipleSampleCVs()
   ↓
3. Tạo 3 CV mẫu và lưu vào localStorage
   - candidateCV_1 (Đỗ Hoàng Hiếu)
   - candidateCV_2 (Phạm Lê Duy)
   - candidateCV_3 (Trần Phương Tuấn)
   ↓
4. User click "Xem hồ sơ" với candidate ID = 1
   ↓
5. ProfileDetailModal load: candidateCV = localStorage.getItem('candidateCV_1')
   ↓
6. Hiển thị CV card + Preview button
   ↓
7. User click "Xem trước CV"
   ↓
8. CVViewerFrame hiển thị: <iframe src={candidateCV.data} />
   ↓
9. User nhập feedback và click Save/Approve/Reject
   ↓
10. localStorage.setItem('feedback_1', JSON.stringify(feedback))
```

## 🎨 Sample CV Content

Mỗi CV mẫu được tạo bằng SVG với:
- **Header**: Tên, job title, contact info (email, phone, location)
- **Sections**:
  - 🎯 Mục tiêu nghề nghiệp
  - 💼 Kinh nghiệm làm việc (3 công ty)
  - 🌟 Kỹ năng (4 skill tags với design đẹp)
  - 🎓 Học vấn
- **Design**: Gradient header (blue), skill tags với border, professional layout

## 🐛 Troubleshooting

### CV không hiển thị?
1. Mở DevTools > Console
2. Check log: "Sample CVs initialized for all candidates"
3. Check localStorage:
   ```javascript
   console.log(localStorage.getItem('candidateCV_1'))
   ```

### PDF Viewer trống?
- SVG data URL có thể không render trong iframe trên một số browser
- Fallback: Click "Tải xuống" để save file

### Build errors?
Kiểm tra:
- `src/utils/sampleCVGenerator.js` đã được tạo đúng
- Import trong Applications.jsx:
  ```javascript
  import { initializeMultipleSampleCVs } from '../../utils/sampleCVGenerator';
  ```

## ✅ Testing Checklist

- [ ] Trang load không có errors trong console
- [ ] 3 ứng viên đều có CV trong localStorage
- [ ] Click "Xem hồ sơ" mở modal thành công
- [ ] CV card hiển thị đúng tên file, size, date
- [ ] Nút "Xem trước CV" toggle viewer on/off
- [ ] PDF viewer hiển thị SVG content
- [ ] Form feedback lưu được notes
- [ ] Nút Approve/Reject update status
- [ ] Timestamp "Cập nhật lần cuối" hiển thị đúng
- [ ] Mở lại modal, feedback cũ được load

## 🔄 Next Steps (Optional)

1. **Convert SVG to real PDF**: Sử dụng library như `jspdf` hoặc `pdfmake`
2. **Upload CV từ Candidate**: Link với CandidateProfile page
3. **Email notification**: Gửi email khi NTD approve/reject
4. **Export feedback**: Export ra Excel hoặc PDF
5. **Version history**: Lưu lịch sử các lần phản hồi

## 📞 Support

Nếu có vấn đề, check các file:
- `src/pages/employer/Applications.jsx` (line 1460-1467)
- `src/utils/sampleCVGenerator.js`
- Browser localStorage trong DevTools

---

🎉 **Tính năng đã hoàn thành và sẵn sàng demo!**
