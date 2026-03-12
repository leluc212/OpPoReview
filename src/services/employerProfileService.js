// Service for managing employer profiles with DynamoDB backend
// This service handles all API calls related to employer profile operations

import { fetchAuthSession } from 'aws-amplify/auth';

// API base URL - TEMPORARILY use direct URL to bypass proxy issues
const API_BASE_URL = 'https://dlidp35x33.execute-api.ap-southeast-1.amazonaws.com/prod';

/**
 * Get authentication token from Amplify Cognito
 */
const getAuthToken = async () => {
  try {
    const session = await fetchAuthSession();
    
    if (!session || !session.tokens) {
      console.warn('⚠️ No session or tokens available');
      return null;
    }
    
    const idToken = session.tokens.idToken;
    if (!idToken) {
      console.warn('⚠️ No ID token in session');
      return null;
    }
    
    // Get the token string - it could be a string or an object with toString()
    let tokenString = typeof idToken === 'string' ? idToken : idToken.toString();
    
    // CRITICAL: Clean token - remove any whitespace, newlines, or special characters
    tokenString = tokenString.trim().replace(/[\r\n\t]/g, '');
    
    console.log('✅ Auth token obtained from Cognito');
    console.log('Token preview:', tokenString.substring(0, 50) + '...');
    console.log('Token length:', tokenString.length);
    
    return tokenString;
  } catch (error) {
    console.error('❌ Error getting auth token from Cognito:', error);
    return null;
  }
};

/**
 * Employer Profile Service
 * 
 * Production implementation using API Gateway + Lambda + DynamoDB
 */
class EmployerProfileService {
  constructor() {
    console.log('📝 EmployerProfileService initialized (API mode)');
    console.log('🔗 API URL:', API_BASE_URL);
  }

  /**
   * Make authenticated API request
   */
  async makeRequest(endpoint, options = {}) {
    try {
      const token = await getAuthToken();
      
      if (!token) {
        console.error('❌ No authentication token available');
        throw new Error('Authentication required - no valid token');
      }
      
      // CRITICAL: Ensure token is clean before adding to header
      const cleanToken = token.trim().replace(/[\r\n\t]/g, '');
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanToken}`,
        ...options.headers
      };

      console.log(`📤 Making ${options.method || 'GET'} request to ${API_BASE_URL}${endpoint}`);
      console.log('🔑 Authorization header length:', headers.Authorization.length);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        mode: 'cors'
      });

      console.log(`📥 Response status: ${response.status}`);

      // Handle 404 as a special case - profile doesn't exist yet
      if (response.status === 404) {
        const error = await response.json().catch(() => ({ message: 'Profile not found' }));
        throw new Error(error.message || 'No profile exists for this user ID');
      }

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: 'Request failed' }));
        console.error(`❌ API Error ${response.status}:`, errorBody);
        throw new Error(errorBody.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API request successful');
      return data;
    } catch (error) {
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('CORS') ||
          error.message.includes('NetworkError') ||
          error.name === 'TypeError') {
        console.error('❌ API request failed - network/CORS issue:', error);
        throw new Error('Cannot connect to API. Using offline mode.');
      }
      throw error;
    }
  }

  /**
   * Get current user's profile
   */
  async getMyProfile() {
    try {
      const session = await fetchAuthSession();
      
      if (!session || !session.tokens) {
        throw new Error('User not authenticated - no session');
      }
      
      // Extract userId from the ID token's sub claim
      const idTokenPayload = session.tokens.idToken?.payload;
      const userId = idTokenPayload?.sub;
      
      console.log('🔍 Getting employer profile for userId:', userId);
      
      if (!userId) {
        throw new Error('User not authenticated - no userId in token');
      }

      const result = await this.makeRequest(`/profile/${userId}`);
      
      if (result.success && result.data) {
        console.log('✅ Employer profile loaded from DynamoDB:', result.data);
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('❌ Error fetching employer profile:', error);
      
      // Return null if profile doesn't exist yet
      if (error.message.includes('not found') || 
          error.message.includes('404') ||
          error.message.includes('No profile exists')) {
        console.log('ℹ️ No employer profile found in DynamoDB - this is normal for new users');
        return null;
      }
      
      // For authentication errors, throw a more specific error
      if (error.message.includes('Forbidden') || 
          error.message.includes('Unauthorized') ||
          error.message.includes('not authenticated')) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      // If API is not available, try localStorage as fallback
      if (error.message.includes('Cannot connect to API') || 
          error.message.includes('offline mode')) {
        console.log('🔄 API unavailable, using localStorage fallback');
        const savedData = localStorage.getItem('employerProfile');
        if (savedData) {
          try {
            const profile = JSON.parse(savedData);
            console.log('✅ Employer profile loaded from localStorage (fallback)');
            return profile;
          } catch (e) {
            console.error('Error parsing localStorage data:', e);
          }
        }
        return null;
      }
      
      throw error;
    }
  }

  /**
   * Create new profile for current user
   */
  async createProfile(profileData) {
    try {
      const session = await fetchAuthSession();
      
      if (!session || !session.tokens) {
        throw new Error('User not authenticated - no session');
      }
      
      const idTokenPayload = session.tokens.idToken?.payload;
      const userId = idTokenPayload?.sub;
      const cognitoEmail = idTokenPayload?.email;
      
      console.log('📝 Creating employer profile for userId:', userId);
      console.log('📧 Using Cognito email:', cognitoEmail);
      
      if (!cognitoEmail) {
        throw new Error('Cannot get verified email from Cognito');
      }
      
      if (!userId) {
        throw new Error('User not authenticated - no userId in token');
      }

      const payload = {
        ...profileData,
        userId: userId,
        email: cognitoEmail,
        profileCompletion: this.calculateCompletion(profileData)
      };

      const result = await this.makeRequest('/profile', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      if (result.success && result.data) {
        console.log('✅ Employer profile created in DynamoDB:', result.data);
        return result.data;
      }

      throw new Error('Failed to create profile');
    } catch (error) {
      console.error('❌ Error creating employer profile:', error);
      
      // If API is not available, save to localStorage as fallback
      if (error.message.includes('Cannot connect to API') || 
          error.message.includes('offline mode')) {
        console.log('🔄 API unavailable, saving to localStorage fallback');
        const fallbackData = {
          ...profileData,
          profileCompletion: this.calculateCompletion(profileData),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('employerProfile', JSON.stringify(fallbackData));
        console.log('✅ Employer profile saved to localStorage (fallback)');
        return fallbackData;
      }
      
      throw error;
    }
  }

  /**
   * Update current user's profile
   */
  async updateProfile(updates) {
    try {
      const session = await fetchAuthSession();
      
      if (!session || !session.tokens) {
        throw new Error('User not authenticated - no session');
      }
      
      const idTokenPayload = session.tokens.idToken?.payload;
      const userId = idTokenPayload?.sub;
      const cognitoEmail = idTokenPayload?.email;
      
      if (!userId) {
        throw new Error('User not authenticated - no userId in token');
      }

      // Remove email from updates - it cannot be changed
      const { email, ...allowedUpdates } = updates;
      
      if (email && email !== cognitoEmail) {
        console.warn('Email cannot be changed. Using Cognito verified email:', cognitoEmail);
      }

      const payload = {
        ...allowedUpdates,
        profileCompletion: this.calculateCompletion(allowedUpdates)
      };

      const result = await this.makeRequest(`/profile/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      
      if (result.success && result.data) {
        console.log('✅ Employer profile updated in DynamoDB:', result.data);
        return result.data;
      }

      throw new Error('Failed to update profile');
    } catch (error) {
      console.error('❌ Error updating employer profile:', error);
      
      // If API is not available, save to localStorage as fallback
      if (error.message.includes('Cannot connect to API') || 
          error.message.includes('offline mode')) {
        console.log('🔄 API unavailable, saving to localStorage fallback');
        const fallbackData = {
          ...updates,
          profileCompletion: this.calculateCompletion(updates),
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('employerProfile', JSON.stringify(fallbackData));
        console.log('✅ Employer profile saved to localStorage (fallback)');
        return fallbackData;
      }
      
      throw error;
    }
  }

  /**
   * Delete current user's profile (soft delete)
   */
  async deleteProfile() {
    try {
      const session = await fetchAuthSession();
      
      if (!session || !session.tokens) {
        throw new Error('User not authenticated - no session');
      }
      
      const idTokenPayload = session.tokens.idToken?.payload;
      const userId = idTokenPayload?.sub;
      
      if (!userId) {
        throw new Error('User not authenticated - no userId in token');
      }

      const result = await this.makeRequest(`/profile/${userId}`, {
        method: 'DELETE'
      });
      
      if (result.success) {
        console.log('✅ Employer profile soft deleted in DynamoDB');
        return true;
      }

      throw new Error('Failed to delete profile');
    } catch (error) {
      console.error('❌ Error deleting employer profile:', error);
      throw error;
    }
  }

  /**
   * Calculate profile completion percentage
   */
  calculateCompletion(profileData) {
    let completion = 0;
    
    // Basic info (40% total - 10% each)
    if (profileData.companyName?.trim()) completion += 10;
    if (profileData.email?.trim()) completion += 10;
    if (profileData.phone?.trim()) completion += 10;
    if (profileData.address?.trim()) completion += 10;
    
    // Business info (30% total - 10% each)
    if (profileData.industry?.trim()) completion += 10;
    if (profileData.companySize?.trim()) completion += 10;
    if (profileData.description?.trim()) completion += 10;
    
    // Company logo (15%)
    if (profileData.companyLogo) completion += 15;
    
    // Website (5%)
    if (profileData.website?.trim()) completion += 5;
    
    // Legal documents (20% - 10% each)
    if (profileData.taxCode?.trim()) completion += 10;
    if (profileData.businessLicense?.trim()) completion += 10;
    
    return completion;
  }
}

// Export singleton instance
export default new EmployerProfileService();
