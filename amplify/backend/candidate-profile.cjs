// DynamoDB table definition for Candidate Profiles
// This table stores personal information for each candidate user

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');

/**
 * Candidate Profile Table Schema
 * 
 * Primary Key: userId (String) - Cognito user ID
 * 
 * Attributes:
 * - userId: String (Primary Key) - Unique identifier from Cognito
 * - fullName: String - Candidate's full name
 * - email: String - Email address
 * - phone: String - Phone number
 * - location: String - Current location/address
 * - cccd: String - Citizen ID number (locked after first set)
 * - dateOfBirth: String - Date of birth in ISO format (locked after first set)
 * - title: String - Professional title/position
 * - bio: String - Professional biography/summary
 * - profileImage: String - Base64 encoded profile image or S3 URL
 * - skills: List<String> - Array of skills
 * - socialLinks: Object - Social media links
 *   - facebook: String - Facebook profile URL
 *   - instagram: String - Instagram profile URL
 *   - zalo: String - Zalo phone number
 *   - website: String - Personal website URL
 * - createdAt: String - ISO timestamp when profile was created
 * - updatedAt: String - ISO timestamp when profile was last updated
 * - profileCompletion: Number - Percentage of profile completion (0-100)
 * - isActive: Boolean - Whether the profile is active
 * 
 * Note: EKYC verification, statistics, and CV/Resume data are stored in separate tables
 */

const tableName = process.env.CANDIDATE_PROFILE_TABLE || 'CandidateProfiles';

// Table configuration
const tableConfig = {
  TableName: tableName,
  KeySchema: [
    { AttributeName: 'userId', KeyType: 'HASH' } // Partition key
  ],
  AttributeDefinitions: [
    { AttributeName: 'userId', AttributeType: 'S' },
    { AttributeName: 'email', AttributeType: 'S' }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'EmailIndex',
      KeySchema: [
        { AttributeName: 'email', KeyType: 'HASH' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    }
  ],
  BillingMode: 'PAY_PER_REQUEST', // On-demand billing
  StreamSpecification: {
    StreamEnabled: true,
    StreamViewType: 'NEW_AND_OLD_IMAGES'
  },
  Tags: [
    { Key: 'Environment', Value: process.env.ENV || 'dev' },
    { Key: 'Application', Value: 'OppoReview' },
    { Key: 'Purpose', Value: 'CandidateProfileManagement' }
  ]
};

// Helper functions for DynamoDB operations
class CandidateProfileService {
  constructor() {
    const client = new DynamoDB({ region: process.env.AWS_REGION || 'ap-southeast-1' });
    this.docClient = DynamoDBDocument.from(client);
  }

  /**
   * Create a new candidate profile
   */
  async createProfile(userId, profileData) {
    const timestamp = new Date().toISOString();
    
    const item = {
      userId,
      fullName: profileData.fullName || '',
      email: profileData.email || '',
      phone: profileData.phone || '',
      location: profileData.location || '',
      cccd: profileData.cccd || '',
      dateOfBirth: profileData.dateOfBirth || '',
      title: profileData.title || '',
      bio: profileData.bio || '',
      profileImage: profileData.profileImage || null,
      skills: profileData.skills || [],
      socialLinks: profileData.socialLinks || {
        facebook: '',
        instagram: '',
        zalo: '',
        website: ''
      },
      createdAt: timestamp,
      updatedAt: timestamp,
      profileCompletion: this.calculateCompletion(profileData),
      isActive: true
    };

    await this.docClient.put({
      TableName: tableName,
      Item: item,
      ConditionExpression: 'attribute_not_exists(userId)' // Prevent overwriting
    });

    return item;
  }

  /**
   * Get candidate profile by userId
   */
  async getProfile(userId) {
    const result = await this.docClient.get({
      TableName: tableName,
      Key: { userId }
    });

    return result.Item;
  }

  /**
   * Get candidate profile by email
   */
  async getProfileByEmail(email) {
    const result = await this.docClient.query({
      TableName: tableName,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    });

    return result.Items?.[0];
  }

  /**
   * Update candidate profile
   * Note: email, cccd and dateOfBirth cannot be updated once set
   */
  async updateProfile(userId, updates) {
    const timestamp = new Date().toISOString();
    
    // Remove fields that shouldn't be updated or will be calculated
    const { 
      userId: _, 
      createdAt, 
      email: __, 
      profileCompletion: ___, // Remove this as we'll calculate it
      updatedAt: ____, // Remove this as we'll set it
      ...allowedUpdates 
    } = updates;
    
    // Check if trying to update locked fields
    const currentProfile = await this.getProfile(userId);
    if (currentProfile) {
      // Email cannot be changed (must match Cognito verified email)
      if (updates.email && currentProfile.email !== updates.email) {
        throw new Error('Email cannot be changed. It must match your verified Cognito email');
      }
      
      if (currentProfile.cccd && updates.cccd && currentProfile.cccd !== updates.cccd) {
        throw new Error('CCCD cannot be changed once set');
      }
      if (currentProfile.dateOfBirth && updates.dateOfBirth && currentProfile.dateOfBirth !== updates.dateOfBirth) {
        throw new Error('Date of birth cannot be changed once set');
      }
    }

    // Build update expression
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    // Add allowed updates
    Object.keys(allowedUpdates).forEach((key, index) => {
      updateExpressions.push(`#field${index} = :value${index}`);
      expressionAttributeNames[`#field${index}`] = key;
      expressionAttributeValues[`:value${index}`] = allowedUpdates[key];
    });

    // Add updatedAt
    const updatedAtIndex = Object.keys(allowedUpdates).length;
    updateExpressions.push(`#field${updatedAtIndex} = :value${updatedAtIndex}`);
    expressionAttributeNames[`#field${updatedAtIndex}`] = 'updatedAt';
    expressionAttributeValues[`:value${updatedAtIndex}`] = timestamp;

    // Add profileCompletion
    const completionIndex = updatedAtIndex + 1;
    updateExpressions.push(`#field${completionIndex} = :value${completionIndex}`);
    expressionAttributeNames[`#field${completionIndex}`] = 'profileCompletion';
    expressionAttributeValues[`:value${completionIndex}`] = this.calculateCompletion({
      ...currentProfile,
      ...allowedUpdates
    });

    const result = await this.docClient.update({
      TableName: tableName,
      Key: { userId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    return result.Attributes;
  }

  /**
   * Delete candidate profile (soft delete by setting isActive to false)
   */
  async deleteProfile(userId) {
    await this.docClient.update({
      TableName: tableName,
      Key: { userId },
      UpdateExpression: 'SET isActive = :false, updatedAt = :timestamp',
      ExpressionAttributeValues: {
        ':false': false,
        ':timestamp': new Date().toISOString()
      }
    });
  }

  /**
   * Calculate profile completion percentage
   */
  calculateCompletion(profileData) {
    let completion = 0;
    
    // Basic info (40% total - 8% each)
    if (profileData.fullName?.trim()) completion += 8;
    if (profileData.email?.trim()) completion += 8;
    if (profileData.phone?.trim()) completion += 8;
    if (profileData.cccd?.trim()) completion += 8;
    if (profileData.dateOfBirth?.trim()) completion += 8;
    
    // Professional info (24% total - 8% each)
    if (profileData.location?.trim()) completion += 8;
    if (profileData.title?.trim()) completion += 8;
    if (profileData.bio?.trim()) completion += 8;
    
    // Profile image (10%)
    if (profileData.profileImage) completion += 10;
    
    // Social links (6% - at least 1 link)
    const hasSocialLinks = profileData.socialLinks?.facebook?.trim() || 
                          profileData.socialLinks?.instagram?.trim() || 
                          profileData.socialLinks?.zalo?.trim() || 
                          profileData.socialLinks?.website?.trim();
    if (hasSocialLinks) completion += 6;
    
    // Skills (10% - at least 3 skills)
    if (profileData.skills?.length >= 3) completion += 10;
    
    // eKYC verification (10%)
    if (profileData.kycCompleted === true) completion += 10;
    
    return Math.min(completion, 100);
  }

  /**
   * List all active candidate profiles (with pagination)
   */
  async listProfiles(limit = 50, lastEvaluatedKey = null) {
    const params = {
      TableName: tableName,
      FilterExpression: 'isActive = :true',
      ExpressionAttributeValues: {
        ':true': true
      },
      Limit: limit
    };

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    const result = await this.docClient.scan(params);

    return {
      items: result.Items,
      lastEvaluatedKey: result.LastEvaluatedKey
    };
  }
}

module.exports = {
  tableConfig,
  tableName,
  CandidateProfileService
};
