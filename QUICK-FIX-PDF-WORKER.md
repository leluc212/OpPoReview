# 🔧 Quick Fix: PDF.js Worker CORS Errors

## Vấn đề
Console hiển thị nhiều lỗi:
```
Failed to fetch dynamically imported module
Access to script at 'https://unpkg.com/...' has been blocked by CORS
Error loading PDF: Error: Setting up fake worker
```

## Nguyên nhân
PDF.js worker đang load từ unpkg.com CDN và gặp CORS issues.

## Giải pháp ✅

### Đã thay đổi
**File:** `src/components/CVPreviewModal.jsx`

**Trước:**
```javascript
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
```

**Sau:**
```javascript
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
```

**Lý do:** cdnjs.cloudflare.com có CORS config tốt hơn unpkg.com

### Cập nhật options
```javascript
options={{
  cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  withCredentials: false,
  standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/standard_fonts/`
}}
```

## Cách test

1. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete
   - Select "Cached images and files"
   - Clear data

2. **Hard refresh:**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

3. **Test CV viewing:**
   - Upload CV
   - Click "Xem CV" (👁️)
   - PDF should load without errors

## Expected Result

### Console (Before)
```
❌ Access to script at 'https://unpkg.com/...' blocked by CORS
❌ Failed to fetch dynamically imported module
❌ Error loading PDF: Setting up fake worker
```

### Console (After)
```
✅ PDF.js worker loaded successfully
✅ PDF document loaded
✅ Rendering page 1
```

## Alternative Solutions

### Option 1: Local Worker (Best for production)
```bash
npm install pdfjs-dist
```

```javascript
import { pdfjs } from 'react-pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
```

### Option 2: Self-hosted Worker
1. Download worker from: https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js
2. Place in `public/pdf.worker.min.js`
3. Update config:
```javascript
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
```

## Troubleshooting

### Still seeing CORS errors?

1. **Check CDN availability:**
```javascript
fetch('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js')
  .then(r => console.log('CDN OK:', r.status))
  .catch(e => console.error('CDN Error:', e));
```

2. **Verify PDF.js version:**
```javascript
import { pdfjs } from 'react-pdf';
console.log('PDF.js version:', pdfjs.version);
```

3. **Check network tab:**
   - Open DevTools → Network
   - Filter: "pdf.worker"
   - Should see 200 status from cdnjs.cloudflare.com

### PDF still not loading?

1. **Check S3 CORS** (should already be fixed):
```powershell
aws s3api get-bucket-cors --bucket opporeview-cv-storage
```

2. **Verify presigned URL:**
   - Copy CV URL from network tab
   - Open in new tab
   - Should download/display PDF

3. **Test with simple PDF:**
```javascript
// In browser console
const testUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
// Try viewing this test PDF
```

## Files Changed

- ✅ `src/components/CVPreviewModal.jsx` - Updated worker source to cdnjs
- ✅ `QUICK-FIX-PDF-WORKER.md` - This documentation

## Next Steps

1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Test CV viewing
4. Check console for errors
5. If still issues, try Option 1 (local worker)

## Production Recommendations

For production, use local worker (Option 1) to:
- Avoid CDN dependencies
- Better performance (no external requests)
- No CORS issues
- Offline support

```bash
npm install pdfjs-dist
```

Then update CVPreviewModal.jsx to use local worker.
