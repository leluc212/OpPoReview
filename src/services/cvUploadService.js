// CV Upload Service
const API_BASE_URL = 'https://v56v542h8f.execute-api.ap-southeast-1.amazonaws.com/prod';

/**
 * Upload CV file to S3
 * @param {string} userId - User ID
 * @param {File} file - CV file (PDF, DOC, DOCX)
 * @returns {Promise<Object>} Upload result with CV URL
 */
export const uploadCV = async (userId, file) => {
  try {
    console.log('📤 [cvUploadService] uploadCV called');
    console.log('📤 [cvUploadService] userId:', userId);
    console.log('📤 [cvUploadService] file:', file.name, file.type, file.size);
    
    // Validate file
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Chỉ chấp nhận file PDF, DOC, DOCX');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File không được vượt quá 5MB');
    }

    // Convert file to base64
    console.log('📤 [cvUploadService] Converting file to base64...');
    const base64Content = await fileToBase64(file);
    console.log('📤 [cvUploadService] Base64 length:', base64Content.length);

    // Sanitize filename
    const safeFileName = sanitizeFilename(file.name);
    console.log('📤 [cvUploadService] Original filename:', file.name);
    console.log('📤 [cvUploadService] Safe filename:', safeFileName);

    const payload = {
      userId,
      fileName: safeFileName,
      fileContent: base64Content.split(',')[1], // Remove data:...;base64, prefix
      fileType: file.type
    };
    
    console.log('📤 [cvUploadService] Payload prepared (without fileContent):', {
      userId: payload.userId,
      fileName: payload.fileName,
      fileType: payload.fileType,
      fileContentLength: payload.fileContent.length
    });

    // Upload to API
    console.log('📤 [cvUploadService] Sending request to:', `${API_BASE_URL}/cv/upload`);
    const response = await fetch(`${API_BASE_URL}/cv/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('📤 [cvUploadService] Response status:', response.status);
    console.log('📤 [cvUploadService] Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ [cvUploadService] Error response:', error);
      throw new Error(error.error || 'Upload thất bại');
    }

    const data = await response.json();
    console.log('✅ [cvUploadService] Success response:', data);
    return data;
  } catch (error) {
    console.error('❌ [cvUploadService] Upload error:', error);
    throw error;
  }
};

/**
 * Get CV information for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} CV list with URLs
 */
export const getCVInfo = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cv/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { cvList: [], totalCVs: 0 }; // No CV found
      }
      const error = await response.json();
      throw new Error(error.error || 'Không thể lấy thông tin CV');
    }

    const data = await response.json();
    
    // Support both old format (single CV) and new format (multiple CVs)
    if (data.cvList) {
      // New format: multiple CVs
      return data;
    } else if (data.cvUrl) {
      // Old format: single CV - convert to array
      return {
        cvList: [{
          id: 1,
          cvUrl: data.cvUrl,
          cvFileName: data.cvFileName,
          cvUploadDate: data.cvUploadDate
        }],
        totalCVs: 1
      };
    } else {
      return { cvList: [], totalCVs: 0 };
    }
  } catch (error) {
    console.error('Error getting CV info:', error);
    throw error;
  }
};

/**
 * Delete CV
 * @param {string} userId - User ID
 * @param {string} cvId - CV ID (optional, if not provided deletes all CVs)
 * @returns {Promise<Object>} Delete result
 */
export const deleteCV = async (userId, cvId = null) => {
  try {
    const url = cvId 
      ? `${API_BASE_URL}/cv/${userId}/${cvId}`  // Delete specific CV
      : `${API_BASE_URL}/cv/${userId}`;          // Delete all CVs (backward compatibility)
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Xóa CV thất bại');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting CV:', error);
    throw error;
  }
};

/**
 * Download CV
 * @param {string} cvUrl - Presigned S3 URL
 * @param {string} fileName - File name for download
 */
export const downloadCV = async (cvUrl, fileName) => {
  try {
    console.log('📥 [downloadCV] Starting download:', fileName);
    console.log('📥 [downloadCV] URL:', cvUrl);
    
    // Method 1: Direct download using anchor tag with presigned URL
    // This works best with presigned URLs that have Content-Disposition header
    const a = document.createElement('a');
    a.href = cvUrl;
    a.download = fileName;
    a.target = '_blank'; // Fallback: open in new tab if download fails
    a.style.display = 'none';
    document.body.appendChild(a);
    
    // Trigger download
    a.click();
    
    // Cleanup after a short delay
    setTimeout(() => {
      document.body.removeChild(a);
    }, 100);
    
    console.log('✅ [downloadCV] Download initiated successfully');
  } catch (error) {
    console.error('❌ [downloadCV] Error downloading CV:', error);
    
    // Fallback: Just open the URL in new tab
    console.log('⚠️ [downloadCV] Falling back to opening in new tab');
    window.open(cvUrl, '_blank');
    
    throw error;
  }
};

/**
 * Sanitize filename to be safe for S3 and URLs
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 */
const sanitizeFilename = (filename) => {
  // Get file extension
  const lastDot = filename.lastIndexOf('.');
  const name = lastDot > 0 ? filename.substring(0, lastDot) : filename;
  const ext = lastDot > 0 ? filename.substring(lastDot) : '';
  
  // Remove or replace problematic characters
  // Keep: letters, numbers, dash, underscore, space
  let safeName = name
    .normalize('NFD') // Decompose Vietnamese characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd').replace(/Đ/g, 'D') // Handle đ/Đ
    .replace(/[^a-zA-Z0-9\s_-]/g, '_') // Replace special chars with underscore
    .replace(/\s+/g, '_') // Replace spaces with underscore
    .replace(/_+/g, '_') // Remove duplicate underscores
    .substring(0, 100); // Limit length
  
  return safeName + ext;
};

/**
 * Convert File to base64
 * @param {File} file - File object
 * @returns {Promise<string>} Base64 string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default {
  uploadCV,
  getCVInfo,
  deleteCV,
  downloadCV
};
