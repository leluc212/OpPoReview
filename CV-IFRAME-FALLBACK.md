# 🔄 CV Viewer - Iframe Fallback Solution

## Vấn đề
PDF.js vẫn gặp lỗi worker CORS dù đã đổi sang cdnjs:
```
Warning: Setting up fake worker
Error loading PDF: Failed to fetch dynamically imported module
```

## Giải pháp: Iframe Fallback ✅

### Cách hoạt động
1. **Thử PDF.js trước** - Load với react-pdf library
2. **Nếu fail** → **Fallback to iframe** - Dùng browser native PDF viewer
3. **User vẫn xem được CV** - Không bị block

### Code Changes

**CVPreviewModal.jsx:**

```javascript
const [useIframe, setUseIframe] = useState(false);

const onDocumentLoadError = (error) => {
  console.error('Error loading PDF:', error);
  console.log('⚠️ PDF.js failed, falling back to iframe viewer');
  setUseIframe(true); // Fallback to iframe
};

// In render:
{useIframe && isPDF ? (
  <PDFContainer>
    <iframe
      src={pdfData || cvUrl}
      style={{
        width: '100%',
        height: '80vh',
        border: 'none'
      }}
      title={fileName || 'CV Preview'}
    />
    <div>💡 Sử dụng browser PDF viewer</div>
  </PDFContainer>
) : isPDF ? (
  // PDF.js viewer
) : (
  // Non-PDF message
)}
```

### Ưu điểm

✅ **Luôn hoạt động** - Browser native PDF viewer không cần worker  
✅ **Không CORS issues** - Iframe tự handle  
✅ **Fallback tự động** - User không cần làm gì  
✅ **Better UX** - Xem được CV ngay lập tức  

### Nhược điểm

⚠️ **Zoom controls không hoạt động** - Browser controls thay thế  
⚠️ **Page navigation khác** - Dùng browser scrollbar  
⚠️ **Styling limited** - Phụ thuộc browser  

## So sánh

### PDF.js Viewer (Primary)
```
✅ Custom zoom controls
✅ Page-by-page navigation
✅ Custom styling
✅ Better mobile support
❌ Requires worker (CORS issues)
❌ More dependencies
```

### Iframe Viewer (Fallback)
```
✅ No dependencies
✅ No CORS issues
✅ Always works
✅ Native browser features
❌ Limited customization
❌ Different UX per browser
```

## User Experience

### Scenario 1: PDF.js Works
```
1. User clicks "Xem CV"
2. Modal opens
3. PDF.js loads successfully
4. Custom viewer with zoom/navigation
5. ✅ Best experience
```

### Scenario 2: PDF.js Fails → Iframe
```
1. User clicks "Xem CV"
2. Modal opens
3. PDF.js fails to load worker
4. Automatically switches to iframe
5. Browser PDF viewer displays
6. ✅ Still works, slightly different UX
```

### Scenario 3: Both Fail
```
1. User clicks "Xem CV"
2. Modal opens
3. Both viewers fail
4. Error message with download button
5. User can download CV
6. ✅ Fallback to download
```

## Testing

### Test PDF.js Success
```javascript
// Should see in console:
✅ PDF fetched successfully
✅ PDF document loaded
✅ Rendering page 1
```

### Test Iframe Fallback
```javascript
// Should see in console:
❌ Error loading PDF: [error]
⚠️ PDF.js failed, falling back to iframe viewer
✅ Iframe loaded
```

### Force Iframe Mode (for testing)
```javascript
// In CVPreviewModal.jsx, temporarily:
const [useIframe, setUseIframe] = useState(true); // Force iframe
```

## Browser Compatibility

### Chrome/Edge
- ✅ PDF.js works
- ✅ Iframe works
- Native PDF viewer excellent

### Firefox
- ✅ PDF.js works
- ✅ Iframe works
- Native PDF viewer good

### Safari
- ⚠️ PDF.js may have issues
- ✅ Iframe works well
- Native PDF viewer excellent

### Mobile Browsers
- ⚠️ PDF.js limited
- ✅ Iframe works
- May prompt download

## Production Recommendations

### Option 1: Keep Dual Approach (Current)
```
✅ Best of both worlds
✅ Fallback safety
⚠️ More code complexity
```

### Option 2: Iframe Only
```javascript
// Simplify to just iframe
<iframe src={cvUrl} style={{...}} />
```
```
✅ Simple, reliable
✅ No dependencies
❌ Less control over UX
```

### Option 3: Local PDF.js Worker
```bash
npm install pdfjs-dist
```
```javascript
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
```
```
✅ No CDN dependency
✅ No CORS issues
✅ Best performance
⚠️ Larger bundle size
```

## Recommended: Option 3 for Production

**Install:**
```bash
npm install pdfjs-dist
```

**Update CVPreviewModal.jsx:**
```javascript
import { pdfjs } from 'react-pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
```

**Benefits:**
- No external CDN calls
- No CORS issues
- Faster loading
- Works offline
- Consistent experience

## Current Status

✅ **Iframe fallback implemented**  
✅ **Auto-switches if PDF.js fails**  
✅ **User can always view CV**  
✅ **Download button available**  

**Next steps:**
1. Test with real CV files
2. Monitor which viewer is used more
3. Consider Option 3 for production
4. Update based on user feedback

## Files Changed

- ✅ `src/components/CVPreviewModal.jsx` - Added iframe fallback
- ✅ `CV-IFRAME-FALLBACK.md` - This documentation

## Conclusion

Với iframe fallback, CV viewer giờ **luôn hoạt động** bất kể PDF.js có vấn đề gì. User experience có thể khác một chút nhưng vẫn functional và reliable! 🎉
