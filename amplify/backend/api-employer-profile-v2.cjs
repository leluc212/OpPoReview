// API Gateway Lambda handler for Employer Profile operations - V2
// Simplified version without API Gateway authorizer
const employerProfileService = require('./employer-profile.cjs');
const jwt = require('jsonwebtoken');

/**
 * Extract userId from JWT token
 */
const getUserIdFromToken = (event) => {
  try {
    // Try both Authorization and authorization headers (case-insensitive)
    const authHeader = event.headers?.Authorization || 
                       event.headers?.authorization ||
                       event.headers?.['Authorization'] ||
                       event.headers?.['authorization'];
    
    console.log('🔐 Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.log('❌ No auth token provided');
      return null;
    }

    // Handle both "Bearer token" and just "token"
    let token = authHeader;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    console.log('🔑 Token length:', token.length);
    
    // Decode without verification (JWT is already verified by Cognito)
    const decoded = jwt.decode(token);
    
    if (!decoded) {
      console.log('❌ Failed to decode token');
      return null;
    }
    
    console.log('✅ Token decoded, userId (sub):', decoded.sub);
    
    return decoded.sub;
  } catch (error) {
    console.error('❌ Error decoding token:', error.message);
    return null;
  }
};

/**
 * CORS headers
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Max-Age': '86400'
};

/**
 * Main Lambda handler
 */
exports.handler = async (event) => {
  console.log('📨 Incoming event:', {
    httpMethod: event.httpMethod,
    path: event.path,
    resource: event.resource,
    headers: Object.keys(event.headers || {})
  });

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    console.log('✅ Handling CORS preflight');
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'OK' })
    };
  }

  try {
    const userId = getUserIdFromToken(event);
    const pathUserId = event.pathParameters?.userId;
    const httpMethod = event.httpMethod;

    console.log('📋 Request details:', { 
      httpMethod, 
      userId: userId ? '***' : 'missing',
      pathUserId: pathUserId ? '***' : 'missing'
    });

    // If no userId from token, return 401
    if (!userId) {
      console.log('❌ No valid userId extracted from token');
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false, 
          message: 'Unauthorized - invalid or missing token',
          error: 'NO_VALID_TOKEN'
        })
      };
    }

    // GET /profile/{userId} - Get profile
    if (httpMethod === 'GET' && pathUserId) {
      console.log('📖 GET /profile/{userId}');
      try {
        const profile = await employerProfileService.getProfile(pathUserId);
        console.log('✅ Profile retrieved');
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ 
            success: true, 
            data: profile 
          })
        };
      } catch (error) {
        if (error.message.includes('No profile exists')) {
          console.log('ℹ️ Profile not found');
          return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({ 
              success: false, 
              message: error.message 
            })
          };
        }
        throw error;
      }
    }

    // POST /profile - Create new profile
    if (httpMethod === 'POST') {
      console.log('✍️ POST /profile - Creating new profile');
      try {
        const body = JSON.parse(event.body || '{}');
        
        // Use userId from token
        body.userId = userId;
        
        console.log('📝 Creating profile for userId:', userId);
        const profile = await employerProfileService.createProfile(body);
        
        console.log('✅ Profile created successfully');
        return {
          statusCode: 201,
          headers: corsHeaders,
          body: JSON.stringify({ 
            success: true, 
            data: profile 
          })
        };
      } catch (error) {
        console.error('❌ Error creating profile:', error.message);
        throw error;
      }
    }

    // PUT /profile/{userId} - Update profile
    if (httpMethod === 'PUT' && pathUserId) {
      console.log('🔄 PUT /profile/{userId} - Updating profile');
      
      // Verify user is updating their own profile
      if (userId !== pathUserId) {
        console.log('❌ User trying to update another user\'s profile');
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: JSON.stringify({ 
            success: false, 
            message: 'Access denied - can only update own profile' 
          })
        };
      }

      try {
        const body = JSON.parse(event.body || '{}');
        
        // Get current profile first
        let currentProfile;
        try {
          currentProfile = await employerProfileService.getProfile(userId);
          console.log('📖 Current profile found');
        } catch (error) {
          // If profile doesn't exist, create it
          if (error.message.includes('No profile exists')) {
            console.log('ℹ️ Profile doesn\'t exist, creating new one');
            body.userId = userId;
            const newProfile = await employerProfileService.createProfile(body);
            return {
              statusCode: 201,
              headers: corsHeaders,
              body: JSON.stringify({ 
                success: true, 
                data: newProfile 
              })
            };
          }
          throw error;
        }
        
        console.log('🔄 Updating profile');
        const updatedProfile = await employerProfileService.updateProfile(
          userId, 
          body,
          currentProfile
        );
        
        console.log('✅ Profile updated successfully');
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ 
            success: true, 
            data: updatedProfile 
          })
        };
      } catch (error) {
        console.error('❌ Error updating profile:', error.message);
        throw error;
      }
    }

    // DELETE /profile/{userId} - Soft delete profile
    if (httpMethod === 'DELETE' && pathUserId) {
      console.log('🗑️ DELETE /profile/{userId} - Deleting profile');
      
      // Verify user can only delete their own profile
      if (userId !== pathUserId) {
        console.log('❌ User trying to delete another user\'s profile');
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: JSON.stringify({ 
            success: false, 
            message: 'Access denied' 
          })
        };
      }

      try {
        await employerProfileService.deleteProfile(userId);
        console.log('✅ Profile deleted successfully');
        
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ 
            success: true, 
            message: 'Profile deleted successfully' 
          })
        };
      } catch (error) {
        console.error('❌ Error deleting profile:', error.message);
        throw error;
      }
    }

    // Invalid route
    console.log('❌ Invalid route:', httpMethod, event.path);
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        message: 'Route not found' 
      })
    };

  } catch (error) {
    console.error('❌ Unhandled error:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        message: error.message || 'Internal server error',
        error: error.name
      })
    };
  }
};
