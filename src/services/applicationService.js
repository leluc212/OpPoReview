import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = 'https://l1636ie205.execute-api.ap-southeast-1.amazonaws.com/prod';

/**
 * Get authenticated headers with JWT token
 */
async function getAuthHeaders() {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    if (!idToken) {
      throw new Error('No authentication token available');
    }
    
    let tokenString = idToken.toString();
    tokenString = tokenString.trim().replace(/[\r\n\t]/g, '');
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenString}`
    };
  } catch (error) {
    console.error('Error getting auth headers:', error);
    // Fallback: use PKCE-token stored by AuthContext (OPPO_ID_TOKEN)
    try {
      const fallback = localStorage.getItem('OPPO_ID_TOKEN');
      if (fallback) {
        const tokenString = fallback.trim();
        return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenString}` };
      }
    } catch (e) { /* ignore */ }
    throw error;
  }
}

function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(atob(payload).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

/**
 * Submit a job application
 * @param {string} jobId - Job ID
 * @param {string} cvUrl - S3 URL of the CV
 * @param {string} cvFilename - Original filename of the CV
 * @returns {Promise<Object>} Application data
 */
export async function submitApplication(jobId, cvUrl, cvFilename) {
  try {
    console.log('📤 Submitting application:', { jobId, cvUrl, cvFilename });
    
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jobId,
        cvUrl,
        cvFilename
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      // Include status code and error code in the error message for better handling
      const errorMsg = error.error || 'Failed to submit application';
      const errorCode = error.code || '';
      const statusCode = response.status;
      
      // Create error with all info
      const err = new Error(errorMsg);
      err.statusCode = statusCode;
      err.errorCode = errorCode;
      err.response = error;
      
      throw err;
    }
    
    const data = await response.json();
    console.log('✅ Application submitted:', data);
    return data;
  } catch (error) {
    console.error('❌ Error submitting application:', error);
    throw error;
  }
}

/**
 * Get all applications for the current candidate
 * @returns {Promise<Array>} List of applications
 */
export async function getMyCandidateApplications() {
  try {
    let userId = null;
    try {
      const session = await fetchAuthSession();
      userId = session.tokens?.idToken?.payload?.sub;
    } catch (e) {
      // try fallback from OPPO_ID_TOKEN
      const fallback = localStorage.getItem('OPPO_ID_TOKEN');
      if (fallback) {
        const payload = decodeJwtPayload(fallback);
        userId = payload?.sub || null;
      }
    }

    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Try Vite proxy first in dev mode to avoid CORS
    const urls = import.meta.env.DEV
      ? [
          `/api-applications/candidate/${userId}`,
          `${API_BASE_URL}/applications/candidate/${userId}`
        ]
      : [`${API_BASE_URL}/applications/candidate/${userId}`];
    
    for (const url of urls) {
      try {
        // In dev mode, when using the Vite proxy (local paths like '/api-applications/...'),
        // avoid attaching the Cognito `Authorization` header so the proxy doesn't forward
        // it to API Gateway (which may interpret it as SigV4 and return 403).
        let response;
        if (import.meta.env.DEV && url.startsWith('/')) {
          response = await fetch(url, { method: 'GET' });
        } else {
          const headers = await getAuthHeaders();
          response = await fetch(url, { method: 'GET', headers });
        }
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Loaded candidate applications:', data);
          return data.applications || [];
        }
        
        // If 403 with IAM error, try without auth
        if (response.status === 403) {
          const errorText = await response.text();
          if (errorText.includes('Invalid key=value pair')) {
            console.warn('🔄 IAM detected on applications API, retrying without auth...');
            const pubResponse = await fetch(url, { method: 'GET', mode: 'cors' });
            if (pubResponse.ok) {
              const data = await pubResponse.json();
              return data.applications || [];
            }
          }
        }
      } catch (fetchErr) {
        console.warn(`⚠️ Failed to fetch applications from ${url}:`, fetchErr.message);
        continue; // Try next URL
      }
    }
    
    // All URLs failed - return empty array for new users
    console.log('ℹ️ No applications found - normal for new users');
    return [];
  } catch (error) {
    console.error('❌ Error getting candidate applications:', error);
    return []; // Return empty instead of throwing for better UX
  }
}

/**
 * Get all applications for a specific job (employer only)
 * @param {string} jobId - Job ID
 * @returns {Promise<Array>} List of applications
 */
export async function getJobApplications(jobId) {
  try {
    console.log('📥 Loading applications for job:', jobId);
    
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/applications/job/${jobId}`, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get job applications');
    }
    
    const data = await response.json();
    console.log('✅ Loaded job applications:', data);
    return data.applications || [];
  } catch (error) {
    console.error('❌ Error getting job applications:', error);
    throw error;
  }
}

/**
 * Update application status (employer only)
 * @param {string} applicationId - Application ID
 * @param {string} status - New status (pending, reviewed, accepted, rejected)
 * @returns {Promise<Object>} Updated application
 */
export async function updateApplicationStatus(applicationId, status) {
  try {
    console.log('📝 Updating application status:', { applicationId, status });
    
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update application status');
    }
    
    const data = await response.json();
    console.log('✅ Application status updated:', data);
    return data;
  } catch (error) {
    console.error('❌ Error updating application status:', error);
    throw error;
  }
}

/**
 * Get all applications (admin only)
 * Intelligent fetcher that handles IAM vs Cognito authorizer mismatches
 * @returns {Promise<Array>} List of all applications
 */
/**
 * Universal Resilient Fetcher for Admin Operations
 * Automatically handles IAM locks, Cognito auth, and Proxy fallbacks
 */
async function fetchResiliently({ path, defaultUrl, serviceName = 'Service' }) {
  // Endpoints in priority: Proxy -> Direct AWS
  const endpoints = [
    { url: path, label: 'Vite Proxy' },
    { url: defaultUrl, label: 'Direct AWS', isDirect: true }
  ];

  const errors = [];
  let iamDetected = false;

  for (const endpoint of endpoints) {
    // Step 1: Try with Cognito Auth
      try {
      console.log(`🔍 [${serviceName}] Attempting fetch: ${endpoint.url} (Auth: true)`);
      const token = await getAuthTokenForApplications();
      const headers = { 'Content-Type': 'application/json' };
      // Only attach Authorization header for direct endpoints (not local proxy paths)
      if (token && !endpoint.url.startsWith('/')) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(endpoint.url, {
        method: 'GET',
        headers,
        mode: 'cors'
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ [${serviceName}] Success with ${endpoint.label} (Authenticated)`);
        return data.applications || (Array.isArray(data) ? data : []);
      }

      const errorBody = await response.text();
      console.warn(`⚠️ [${serviceName}] ${endpoint.label} failed with ${response.status}: ${errorBody.substring(0, 50)}...`);

      // Detection: "Invalid key=value pair" means IAM is blocking the Cognito token
      if (response.status === 403 && (errorBody.includes('Invalid key=value pair') || errorBody.includes('Credential='))) {
        console.warn(`🚨 [${serviceName}] IAM Authorizer detected on ${endpoint.label}! Retrying without headers...`);
        iamDetected = true;
      }
    } catch (err) {
      console.error(`❌ [${serviceName}] Network/CORS error on ${endpoint.label}:`, err.message);
      errors.push({ label: endpoint.label, error: err.message });
    }

    // Step 2: Try without headers (for public or IAM-optional gateways)
    try {
      console.log(`🔍 [${serviceName}] Attempting fetch: ${endpoint.url} (Auth: false)`);
      const response = await fetch(endpoint.url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ [${serviceName}] Success with ${endpoint.label} (Public)`);
        return data.applications || (Array.isArray(data) ? data : []);
      }
    } catch (publicErr) {
      console.warn(`❌ [${serviceName}] Public fetch failed on ${endpoint.label}`);
    }
  }

  console.error(`❌ [${serviceName}] All fetch paths exhausted for ${path}`);
  const fallback = [];
  fallback._isBlockedByIam = iamDetected;
  fallback._errorCount = errors.length;
  return fallback;
}

/**
 * Get authentication token (reused here to avoid duplicating getAuthHeaders for the unified fetcher)
 */
async function getAuthTokenForApplications() {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    if (!idToken) return null;
    return idToken.toString().trim().replace(/[\r\n\t]/g, '');
  } catch (err) {
    return null;
  }
}

const applicationService = {
  submitApplication,
  getMyCandidateApplications,
  getJobApplications,
  updateApplicationStatus,
  
  /**
   * Get all applications via Vite proxy → Lambda Function URL (no browser CORS issues)
   */
  async getAllApplications() {
    return fetchResiliently({
      path: '/api-lambda-applications/applications',
      defaultUrl: 'https://65fnfwjx5m7iq5ilmoj5ea7nwq0cespm.lambda-url.ap-southeast-1.on.aws/applications',
      serviceName: 'ApplicationService'
    });
  }
};

export default applicationService;
