# Implementation: Multiple CV Upload & Selection

## ✅ Đã hoàn thành

### 1. CVUpload Component (src/components/CVUpload.jsx)
- ✅ Thay đổi state từ `cvInfo` → `cvList` (array)
- ✅ Giới hạn tối đa 3 CV (`MAX_CV_COUNT = 3`)
- ✅ Hiển thị danh sách CV với nút xem/xóa
- ✅ Upload thêm CV mới (nếu chưa đạt giới hạn)
- ✅ Thông báo khi đã đạt giới hạn

### 2. JobListing Component (src/pages/candidate/JobListing.jsx)
- ✅ Thêm state `selectedCV` và `candidateCVList`
- ✅ Thêm styled components cho CV selection

## 🔄 Cần hoàn thành

### 3. Load danh sách CV khi mở modal ứng tuyển

Thêm vào `handleApplyJob` function:

```javascript
const handleApplyJob = async (job) => {
  if (job) {
    // Load danh sách CV của ứng viên
    try {
      const cvService = (await import('../services/cvUploadService')).default;
      const session = await fetchAuthSession();
      const userId = session.tokens?.idToken?.payload?.sub;
      
      if (userId) {
        const cvInfo = await cvService.getCVInfo(userId);
        
        // Convert to array format
        if (cvInfo && cvInfo.cvUrl) {
          setCandidateCVList([{
            id: 1,
            cvUrl: cvInfo.cvUrl,
            cvFileName: cvInfo.cvFileName,
            cvUploadDate: cvInfo.cvUploadDate
          }]);
          setSelectedCV(1); // Auto select first CV
        } else {
          setCandidateCVList([]);
          setSelectedCV(null);
        }
      }
    } catch (error) {
      console.error('Error loading CV list:', error);
      setCandidateCVList([]);
    }
    
    setApplyModal({ job });
  }
};
```

### 4. Thêm phần chọn CV vào Apply Modal

Trong phần render của `applyModal`, thêm sau `.apply-desc`:

```jsx
{/* CV Selection Section */}
<CVSelectionSection>
  <CVSelectionTitle>
    📄 Chọn CV để ứng tuyển
  </CVSelectionTitle>
  
  {candidateCVList.length > 0 ? (
    candidateCVList.map(cv => (
      <CVOption
        key={cv.id}
        $selected={selectedCV === cv.id}
        onClick={() => setSelectedCV(cv.id)}
      >
        <CVRadio $selected={selectedCV === cv.id} />
        <CVOptionInfo>
          <CVOptionName>{cv.cvFileName}</CVOptionName>
          <CVOptionDate>
            Tải lên: {new Date(cv.cvUploadDate).toLocaleDateString('vi-VN')}
          </CVOptionDate>
        </CVOptionInfo>
      </CVOption>
    ))
  ) : (
    <NoCVMessage>
      ⚠️ Bạn chưa có CV nào. <a href="/candidate/profile">Tải lên CV</a> để ứng tuyển.
    </NoCVMessage>
  )}
</CVSelectionSection>
```

### 5. Cập nhật nút "Xác nhận ứng tuyển"

Disable nút nếu chưa chọn CV:

```jsx
<button 
  className="btn-confirm" 
  onClick={handleSubmitApplication}
  disabled={!selectedCV || isSubmitting}
  style={{
    opacity: !selectedCV ? 0.5 : 1,
    cursor: !selectedCV ? 'not-allowed' : 'pointer'
  }}
>
  {isSubmitting 
    ? (language === 'vi' ? 'Đang gửi...' : 'Submitting...') 
    : (language === 'vi' ? 'Xác nhận ứng tuyển' : 'Confirm Application')
  }
</button>
```

### 6. Gửi CV đã chọn khi ứng tuyển

Trong `handleSubmitApplication`, thêm thông tin CV:

```javascript
const handleSubmitApplication = async () => {
  if (!selectedCV) {
    setError('Vui lòng chọn CV để ứng tuyển');
    return;
  }
  
  // ... existing validation code ...
  
  try {
    setIsSubmitting(true);
    
    const selectedCVData = candidateCVList.find(cv => cv.id === selectedCV);
    
    const applicationService = (await import('../../services/applicationService')).default;
    const jobId = applyModal.job.idJob || applyModal.job.id;
    
    await applicationService.submitApplication({
      jobId: jobId,
      cvUrl: selectedCVData.cvUrl,
      cvFileName: selectedCVData.cvFileName,
      // ... other application data
    });
    
    // ... success handling ...
  } catch (error) {
    // ... error handling ...
  } finally {
    setIsSubmitting(false);
  }
};
```

## 🔧 Backend Changes Needed

### 1. Update DynamoDB Schema

Thêm field `cvList` vào CandidateProfile table:

```javascript
{
  userId: "xxx",
  cvList: [
    {
      id: "cv-1",
      cvUrl: "s3://...",
      cvFileName: "CV_TanLuc.pdf",
      cvUploadDate: "2026-03-14T10:00:00Z"
    },
    {
      id: "cv-2",
      cvUrl: "s3://...",
      cvFileName: "CV_English.pdf",
      cvUploadDate: "2026-03-14T11:00:00Z"
    }
  ]
}
```

### 2. Update Lambda Functions

**Upload CV:**
```javascript
// Thêm CV vào array thay vì replace
const existingProfile = await getProfile(userId);
const cvList = existingProfile.cvList || [];

if (cvList.length >= 3) {
  throw new Error('Maximum 3 CVs allowed');
}

cvList.push({
  id: `cv-${Date.now()}`,
  cvUrl: uploadedUrl,
  cvFileName: fileName,
  cvUploadDate: new Date().toISOString()
});

await updateProfile(userId, { cvList });
```

**Delete CV:**
```javascript
// Xóa CV khỏi array
const existingProfile = await getProfile(userId);
const cvList = existingProfile.cvList || [];

const updatedList = cvList.filter(cv => cv.id !== cvIdToDelete);

await updateProfile(userId, { cvList: updatedList });
```

**Get CV Info:**
```javascript
// Trả về toàn bộ danh sách
const profile = await getProfile(userId);
return {
  cvList: profile.cvList || []
};
```

## 📝 Testing Checklist

- [ ] Upload 1 CV → hiển thị trong danh sách
- [ ] Upload thêm 2 CV nữa → tổng 3 CV
- [ ] Thử upload CV thứ 4 → hiện thông báo giới hạn
- [ ] Xóa 1 CV → có thể upload thêm
- [ ] Click "Ứng tuyển" → hiện modal với danh sách CV
- [ ] Chọn CV → radio button được chọn
- [ ] Không chọn CV → nút "Xác nhận" bị disable
- [ ] Chọn CV và ứng tuyển → gửi thành công với CV đã chọn
- [ ] Kiểm tra trong DynamoDB → CV được lưu đúng

## 🎨 UI/UX Improvements

1. **Thêm icon cho từng CV** (PDF, DOC, DOCX)
2. **Hiển thị kích thước file**
3. **Cho phép đổi tên CV** (optional)
4. **Đánh dấu CV mặc định** (optional)
5. **Preview CV trước khi ứng tuyển** (optional)

## 🚀 Next Steps

1. Implement backend changes (Lambda + DynamoDB)
2. Update frontend code theo hướng dẫn trên
3. Test thoroughly
4. Deploy to production
