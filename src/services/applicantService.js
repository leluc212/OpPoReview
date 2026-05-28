// Applicant Service
// Lấy danh sách ứng viên từ DynamoDB qua API Gateway xyp4wkszi7 (COGNITO_USER_POOLS authorizer)
// Route: GET /api -> proxy đến xyp4wkszi7.execute-api.../prod/candidates

import { fetchAuthSession } from 'aws-amplify/auth';

// DEV: dùng Vite proxy /api -> xyp4wkszi7/prod/candidates (Cognito-authorized)
// PROD: gọi thẳng endpoint
const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_CANDIDATE_API_URL || 'https://xyp4wkszi7.execute-api.ap-southeast-1.amazonaws.com/prod/candidates');

/**
 * Lấy Cognito ID Token từ Amplify session
 * Endpoint xyp4wkszi7 dùng COGNITO_USER_POOLS authorizer nên BẮT BUỘC phải có token
 */
const getAuthToken = async () => {
  try {
    const session = await fetchAuthSession();
    if (!session?.tokens?.idToken) {
      console.warn('⚠️ [ApplicantService] Không có Cognito session/token');
      return null;
    }
    const raw = session.tokens.idToken;
    // Đảm bảo token là string thuần, không có ký tự thừa
    return (typeof raw === 'string' ? raw : raw.toString()).trim().replace(/[\r\n\t]/g, '');
  } catch (err) {
    console.error('❌ [ApplicantService] Lỗi lấy auth token:', err);
    return null;
  }
};

/**
 * Xử lý response từ fetch
 */
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * Applicant Service
 * Tải toàn bộ dữ liệu ứng viên từ DynamoDB để xử lý cục bộ
 */
const applicantService = {
  async getAllApplicants() {
    try {
      console.log('📡 [ApplicantService] Đang tải dữ liệu ứng viên từ DynamoDB...');

      // xyp4wkszi7 dùng Cognito authorizer -> phải gửi Bearer token
      const token = await getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🔑 [ApplicantService] Đã đính kèm Cognito token');
      } else {
        console.warn('⚠️ [ApplicantService] Không có token - request có thể bị từ chối (Missing Authentication Token)');
      }

      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers,
        mode: 'cors'
      });

      const data = await handleResponse(response);

      // Lọc bỏ record rác / ghost không có email hoặc tên thật
      if (Array.isArray(data)) {
        const filtered = data.filter(item =>
          (item.email && item.email.includes('@')) ||
          (item.fullName && item.fullName.trim() !== '' && item.fullName !== 'Unknown User')
        );
        console.log(`✅ [ApplicantService] Tải thành công ${filtered.length}/${data.length} ứng viên hợp lệ`);
        return filtered;
      }

      return [];
    } catch (error) {
      console.error('❌ [ApplicantService] Lỗi tải ứng viên:', error.message);
      throw error;
    }
  }
};

export default applicantService;
