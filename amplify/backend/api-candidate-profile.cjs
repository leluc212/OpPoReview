// API endpoints for Candidate Profile management
// These Lambda functions handle CRUD operations for candidate profiles

const { CandidateProfileService } = require('./candidate-profile.cjs');

/**
 * Lambda handler for candidate profile operations
 * 
 * Supported operations:
 * - GET /profile/{userId} - Get profile by user ID
 * - POST /profile - Create new profile
 * - PUT /profile/{userId} - Update profile
 * - DELETE /profile/{userId} - Soft delete profile
 * - GET /profile/email/{email} - Get profile by email
 */

const profileService = new CandidateProfileService();

// Helper function to create API response
const createResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  },
  body: JSON.stringify(body)
});

/**
 * Extract userId from JWT token in Authorization header
 */
const extractUserIdFromToken = (authHeader) => {
  try {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.replace('Bearer ', '');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
    const payload = JSON.parse(jsonPayload);
    
    return payload.sub; // Cognito userId
  } catch (error) {
    console.error('Error extracting userId from token:', error);
    return null;
  }
};

// Main Lambda handler
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const { httpMethod, path, pathParameters, body: requestBody, headers } = event;
  
  // Get userId from JWT token in Authorization header
  let userId = extractUserIdFromToken(headers?.Authorization || headers?.authorization);
  
  // Fallback to path parameters if no token
  if (!userId) {
    userId = pathParameters?.userId;
  }
  
  console.log('Extracted userId:', userId);

  try {
    // Handle OPTIONS request for CORS
    if (httpMethod === 'OPTIONS') {
      return createResponse(200, { message: 'OK' });
    }

    // GET /profile/{userId} - Get profile
    if (httpMethod === 'GET' && pathParameters?.userId) {
      const profile = await profileService.getProfile(pathParameters.userId);
      
      if (!profile) {
        return createResponse(404, { 
          error: 'Profile not found',
          message: 'No profile exists for this user ID'
        });
      }

      return createResponse(200, { 
        success: true,
        data: profile 
      });
    }

    // GET /profile/email/{email} - Get profile by email
    if (httpMethod === 'GET' && path.includes('/email/')) {
      const email = pathParameters?.email;
      const profile = await profileService.getProfileByEmail(email);
      
      if (!profile) {
        return createResponse(404, { 
          error: 'Profile not found',
          message: 'No profile exists for this email'
        });
      }

      return createResponse(200, { 
        success: true,
        data: profile 
      });
    }

    // POST /profile - Create new profile
    if (httpMethod === 'POST') {
      // Use userId from JWT token
      if (!userId) {
        return createResponse(401, { 
          error: 'Unauthorized',
          message: 'Valid authentication token is required'
        });
      }

      const profileData = JSON.parse(requestBody);
      
      // Validate required fields
      if (!profileData.fullName || !profileData.email || !profileData.phone) {
        return createResponse(400, { 
          error: 'Validation error',
          message: 'Full name, email, and phone are required'
        });
      }

      // Use userId from token, not from request body
      const newProfile = await profileService.createProfile(userId, profileData);

      return createResponse(201, { 
        success: true,
        message: 'Profile created successfully',
        data: newProfile 
      });
    }

    // PUT /profile/{userId} - Update profile
    if (httpMethod === 'PUT' && pathParameters?.userId) {
      const updates = JSON.parse(requestBody);
      
      // Verify user is updating their own profile
      if (userId && userId !== pathParameters.userId) {
        return createResponse(403, { 
          error: 'Forbidden',
          message: 'You can only update your own profile'
        });
      }

      try {
        const updatedProfile = await profileService.updateProfile(pathParameters.userId, updates);

        return createResponse(200, { 
          success: true,
          message: 'Profile updated successfully',
          data: updatedProfile 
        });
      } catch (error) {
        if (error.message.includes('cannot be changed')) {
          return createResponse(400, { 
            error: 'Validation error',
            message: error.message
          });
        }
        throw error;
      }
    }

    // DELETE /profile/{userId} - Soft delete profile
    if (httpMethod === 'DELETE' && pathParameters?.userId) {
      // Verify user is deleting their own profile
      if (userId && userId !== pathParameters.userId) {
        return createResponse(403, { 
          error: 'Forbidden',
          message: 'You can only delete your own profile'
        });
      }

      await profileService.deleteProfile(pathParameters.userId);

      return createResponse(200, { 
        success: true,
        message: 'Profile deleted successfully'
      });
    }

    // Invalid route
    return createResponse(404, { 
      error: 'Not found',
      message: 'Invalid API endpoint'
    });

  } catch (error) {
    console.error('Error:', error);

    // Handle specific DynamoDB errors
    if (error.name === 'ConditionalCheckFailedException') {
      return createResponse(409, { 
        error: 'Conflict',
        message: 'Profile already exists for this user'
      });
    }

    if (error.name === 'ResourceNotFoundException') {
      return createResponse(404, { 
        error: 'Not found',
        message: 'Profile table not found'
      });
    }

    // Generic error response
    return createResponse(500, { 
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred'
    });
  }
};

/**
 * Lambda handler for batch operations
 * Used for admin operations or data migration
 */
exports.batchHandler = async (event) => {
  const profileService = new CandidateProfileService();

  try {
    const { operation, data } = JSON.parse(event.body || '{}');

    switch (operation) {
      case 'listProfiles':
        const { limit, lastEvaluatedKey } = data || {};
        const result = await profileService.listProfiles(limit, lastEvaluatedKey);
        return createResponse(200, { 
          success: true,
          data: result 
        });

      default:
        return createResponse(400, { 
          error: 'Invalid operation',
          message: 'Supported operations: listProfiles'
        });
    }
  } catch (error) {
    console.error('Batch operation error:', error);
    return createResponse(500, { 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
