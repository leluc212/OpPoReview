// API Gateway Lambda handler for Employer Profile operations
const employerProfileService = require('./employer-profile.cjs');
const jwt = require('jsonwebtoken');

/**
 * Extract userId from JWT token
 */
const getUserIdFromToken = (event) => {
  try {
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    console.log('Auth header:', authHeader ? 'present' : 'missing');
    
    if (!authHeader) {
      console.log('No auth token provided');
      return null;
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.log('Invalid auth header format');
      return null;
    }

    const token = authHeader.substring(7);
    console.log('Token length:', token.length);
    
    // Decode without verification (JWT is already verified by API Gateway if using authorizer)
    const decoded = jwt.decode(token);
    console.log('Decoded token sub:', decoded?.sub);
    
    return decoded?.sub;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * CORS headers
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

/**
 * Main Lambda handler
 */
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
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

    console.log('Request:', { httpMethod, userId, pathUserId });

    // If no userId from token, return 401
    if (!userId) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false, 
          message: 'Unauthorized - no valid token' 
        })
      };
    }

    // GET /profile/{userId} - Get profile
    if (httpMethod === 'GET' && pathUserId) {
      try {
        const profile = await employerProfileService.getProfile(pathUserId);
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
      const body = JSON.parse(event.body || '{}');
      
      // Use userId from token
      body.userId = userId;
      
      const profile = await employerProfileService.createProfile(body);
      
      return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: true, 
          data: profile 
        })
      };
    }

    // PUT /profile/{userId} - Update profile
    if (httpMethod === 'PUT' && pathUserId) {
      // Verify user is updating their own profile
      if (userId !== pathUserId) {
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: JSON.stringify({ 
            success: false, 
            message: 'Access denied - can only update own profile' 
          })
        };
      }

      const body = JSON.parse(event.body || '{}');
      
      // Get current profile first
      let currentProfile;
      try {
        currentProfile = await employerProfileService.getProfile(userId);
      } catch (error) {
        // If profile doesn't exist, create it
        if (error.message.includes('No profile exists')) {
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
      
      const updatedProfile = await employerProfileService.updateProfile(
        userId, 
        body,
        currentProfile
      );
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: true, 
          data: updatedProfile 
        })
      };
    }

    // DELETE /profile/{userId} - Soft delete profile
    if (httpMethod === 'DELETE' && pathUserId) {
      // Verify user can only delete their own profile
      if (userId !== pathUserId) {
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: JSON.stringify({ 
            success: false, 
            message: 'Access denied' 
          })
        };
      }

      await employerProfileService.deleteProfile(userId);
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: true, 
          message: 'Profile deleted successfully' 
        })
      };
    }

    // Invalid route
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        message: 'Route not found' 
      })
    };

  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        message: error.message || 'Internal server error' 
      })
    };
  }
};
