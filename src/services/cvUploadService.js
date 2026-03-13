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
    const base64Content = await fileToBase64(file);

    // Upload to API
    const response = await fetch(`${API_BASE_URL}/cv/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        fileName: file.name,
        fileContent: base64Content.split(',')[1], // Remove data:...;base64, prefix
        fileType: file.type
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload thất bại');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading CV:', error);
    throw error;
  }
};

/**
 * Get CV information for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} CV info with URL
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
        return null; // No CV found
      }
      const error = await response.json();
      throw new Error(error.error || 'Không thể lấy thông tin CV');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting CV info:', error);
    throw error;
  }
};

/**
 * Delete CV
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteCV = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cv/${userId}`, {
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
    const response = await fetch(cvUrl);
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading CV:', error);
    throw error;
  }
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
