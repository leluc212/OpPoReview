// API Gateway Lambda handler for Employer Profile Admin operations
const employerProfileService = require('./employer-profile.cjs');
const jwt = require('jsonwebtoken');

/**
 * Extract userId and check if user is admin
 */
const getUserFromToken = (event) => {
  try {
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { userId: null, isAdmin: false };
    }

    const token = authHeader.substring(7);
    const decoded = jwt.decode(token);
    
    // Check if user is in admin group
    const groups = decoded?.['cognito:groups'] || [];
    const isAdmin = groups.includes('Admin') || groups.includes('admin');
    
    return {
      userId: decoded?.sub,
      isAdmin
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return { userId: null, isAdmin: false };
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
 * Main Lambda handler with admin routes
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
    const { userId, isAdmin } = getUserFromToken(event);
    const httpMethod = event.httpMethod;
    const path = event.path;

    console.log('Request:', { httpMethod, path, userId, isAdmin });

    // Admin routes - require admin privileges
    if (path.startsWith('/admin/')) {
      if (!isAdmin) {
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: JSON.stringify({ 
            success: false, 
            message: 'Access denied - admin privileges required' 
          })
        };
      }

      // GET /admin/employers - Get all employer profiles
      if (httpMethod === 'GET' && path === '/admin/employers') {
        try {
          const result = await employerProfileService.listAllProfiles();
          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ 
              success: true, 
              data: result.profiles 
            })
          };
        } catch (error) {
          console.error('Error listing employers:', error);
          throw error;
        }
      }

      // POST /admin/employers/{userId}/approve - Approve employer
      if (httpMethod === 'POST' && path.match(/^\/admin\/employers\/[^/]+\/approve$/)) {
        const pathUserId = path.split('/')[3];
        const body = JSON.parse(event.body || '{}');
        
        try {
          const updatedProfile = await employerProfileService.updateApprovalStatus(
            pathUserId,
            'approved',
            body
          );
          
          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ 
              success: true, 
              data: updatedProfile 
            })
          };
        } catch (error) {
          console.error('Error approving employer:', error);
          throw error;
        }
      }

      // POST /admin/employers/{userId}/reject - Reject employer
      if (httpMethod === 'POST' && path.match(/^\/admin\/employers\/[^/]+\/reject$/)) {
        const pathUserId = path.split('/')[3];
        const body = JSON.parse(event.body || '{}');
        
        try {
          const updatedProfile = await employerProfileService.updateApprovalStatus(
            pathUserId,
            'rejected',
            body
          );
          
          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ 
              success: true, 
              data: updatedProfile 
            })
          };
        } catch (error) {
          console.error('Error rejecting employer:', error);
          throw error;
        }
      }

      // POST /admin/employers/{userId}/verify - Update verification status
      if (httpMethod === 'POST' && path.match(/^\/admin\/employers\/[^/]+\/verify$/)) {
        const pathUserId = path.split('/')[3];
        const body = JSON.parse(event.body || '{}');
        
        try {
          const updatedProfile = await employerProfileService.updateVerificationStatus(
            pathUserId,
            body.isVerified,
            body
          );
          
          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ 
              success: true, 
              data: updatedProfile 
            })
          };
        } catch (error) {
          console.error('Error updating verification:', error);
          throw error;
        }
      }
    }

    // Regular user routes (existing functionality)
    const pathUserId = event.pathParameters?.userId;

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
    if (httpMethod === 'POST' && path === '/profile') {
      const body = JSON.parse(event.body || '{}');
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
      if (userId !== pathUserId && !isAdmin) {
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
      
      let currentProfile;
      try {
        currentProfile = await employerProfileService.getProfile(pathUserId);
      } catch (error) {
        if (error.message.includes('No profile exists')) {
          body.userId = pathUserId;
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
        pathUserId, 
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
      if (userId !== pathUserId && !isAdmin) {
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: JSON.stringify({ 
            success: false, 
            message: 'Access denied' 
          })
        };
      }

      await employerProfileService.deleteProfile(pathUserId);
      
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
